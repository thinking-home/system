using System;
using System.Buffers;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Protocol;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.Mqtt.DynamicConfiguration;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Scripts.Attributes;
using ThinkingHome.Plugins.Timer;
using Buffer = ThinkingHome.Plugins.Scripts.Buffer;

namespace ThinkingHome.Plugins.Mqtt;

public class MqttPlugin(ScriptsPlugin scripts) : PluginBase {
    #region settings

    private const string DEFAULT_HOST = "localhost";
    private const int DEFAULT_PORT = 1883;

    private bool reconnectEnabled;

    private readonly ObjectRegistry<MqttConfigurationBuilder.MqttListenerDefinition> listeners = new();

    private string Host => Configuration.GetValue("host", DEFAULT_HOST);
    private int Port => Configuration.GetValue("port", DEFAULT_PORT);
    private string Login => Configuration["login"];
    private string Password => Configuration["password"];

    private Dictionary<string, string> ScriptEvents => Configuration
        .GetSection("scriptEvents")
        .Get<Dictionary<string, string>>();

    #endregion

    private IMqttClient client;
    private MqttClientOptions options;
    private readonly Dictionary<uint, string> topicIndexById = new();

    public override void InitPlugin()
    {
        var clientId = Guid.NewGuid().ToString();

        Logger.LogInformation("init MQTT client: {Url} (ID: {ClientId})", $"{Host}:{Port}", clientId);

        options = new MqttClientOptionsBuilder()
            .WithClientId(clientId)
            .WithTcpServer(Host, Port)
            .WithCredentials(Login, Password)
            .Build();

        var mqttFactory = new MqttClientFactory();
        client = mqttFactory.CreateMqttClient();

        client.ConnectedAsync += client_Connected;
        client.DisconnectedAsync += client_Disconnected;
        client.ApplicationMessageReceivedAsync += client_ApplicationMessageReceived;

        // listeners
        RegisterListeners();
        listeners.ForEach((topic, def) =>
            Logger.LogInformation("register MQTT message handler: {Topic} ({PluginType})", topic, def.Source.FullName));
    }

    public override void StartPlugin()
    {
        reconnectEnabled = true;
        ReConnect();
    }

    public override void StopPlugin()
    {
        reconnectEnabled = false;

        if (client.IsConnected) {
            lock (client) {
                if (client.IsConnected) {
                    client.DisconnectAsync().Wait();
                }
            }
        }

        client.Dispose();
    }

    [TimerCallback(60000)]
    public void ConnectionChecking(DateTime now)
    {
        ReConnect();
    }

    [ScriptCommand("mqttPublishString")]
    public void Publish(string topic, string payload, bool retain = false)
    {
        Publish(topic, Encoding.UTF8.GetBytes(payload), retain);
    }

    [ScriptCommand("mqttPublishBuffer")]
    public void Publish(string topic, Buffer payload, bool retain = false)
    {
        Publish(topic, payload.GetBytes(), retain);
    }

    public void Publish(string topic, byte[] payload, bool retain = false)
    {
        var msg = new MqttApplicationMessageBuilder()
            .WithTopic(topic)
            .WithPayload(payload)
            .WithQualityOfServiceLevel(MqttQualityOfServiceLevel.AtLeastOnce)
            .WithRetainFlag(retain)
            .Build();

        var ex = client.PublishAsync(msg).Exception;

        if (ex != null) {
            throw ex;
        }
    }

    #region private

    private void RegisterListeners()
    {
        var inits = Context.GetAllPlugins()
            .SelectMany(p => p.FindMethods<ConfigureMqttAttribute, ConfigureMqttDelegate>())
            .ToArray();

        uint currentId = 1377000;

        foreach (var (_, fn, plugin) in inits) {
            var source = plugin.GetType();

            using var configBuilder = new MqttConfigurationBuilder(source, listeners, () => ++currentId);
            fn(configBuilder);
        }

        // script events
        if (ScriptEvents != null) {
            using var scriptEventsConfigBuilder = new MqttConfigurationBuilder(GetType(), listeners, () => ++currentId);
            
            foreach (var e in ScriptEvents) {
                var topicFilter = e.Key.Trim();
                var scriptEvent = e.Value.Trim();

                if (string.IsNullOrWhiteSpace(topicFilter) || string.IsNullOrWhiteSpace(scriptEvent)) continue;

                Logger.LogInformation("Register \"{ScriptEvent}\" script event for \"{TopicFilter}\" MQTT topic filter", scriptEvent, topicFilter);

                scriptEventsConfigBuilder.RegisterListener(topicFilter,
                    (topic, payloadBytes) => { scripts.EmitScriptEvent(scriptEvent, topic, new Buffer(payloadBytes)); });
            }
        }

        foreach (var item in listeners.Data) {
            topicIndexById[item.Value.TopicFilterId] = item.Key;
        }
    }

    private void ReConnect()
    {
        if (client is { IsConnected: false } && reconnectEnabled) {
            lock (client) {
                if (client is { IsConnected: false } && reconnectEnabled) {
                    try {
                        Logger.LogInformation("connect to MQTT broker");

                        var task = client.ConnectAsync(options);
                        task.Wait();

                        if (task.Exception != null) throw task.Exception;
                    }
                    catch (Exception ex) {
                        Logger.LogWarning(ex.Message);
                    }
                }
            }
        }
    }

    private async Task client_Connected(MqttClientConnectedEventArgs e)
    {
        Logger.LogInformation("MQTT client is connected");

        foreach (var sub in listeners.Data.Values) {
            Logger.LogInformation("Subscribe MQTT client to {Topic} topic filter", sub.TopicFilter);
            var opts = new MqttClientSubscribeOptionsBuilder()
                .WithTopicFilter(sub.TopicFilter)
                .WithSubscriptionIdentifier(sub.TopicFilterId)
                .Build();

            await client.SubscribeAsync(opts);
        }

        Logger.LogInformation("MQTT client is subscribed");
    }

    private Task client_Disconnected(MqttClientDisconnectedEventArgs e)
    {
        Logger.LogInformation("MQTT connection closed");
        return Task.CompletedTask;
    }

    private async Task client_ApplicationMessageReceived(MqttApplicationMessageReceivedEventArgs e)
    {
        var msg = e.ApplicationMessage;
        var payloadBytes = msg.Payload.ToArray();
        var payloadString = Encoding.UTF8.GetString(payloadBytes);
        var subIds = msg.SubscriptionIdentifiers ?? [];

        Logger.LogDebug(
            "subs: {Subs}, topic: {Topic}, payload: {Payload}, qos: {QualityOfServiceLevel}, retain: {Retain}",
            string.Join(',', subIds), msg.Topic, payloadString, msg.QualityOfServiceLevel, msg.Retain);

        // handlers
        foreach (var subscriptionId in msg.SubscriptionIdentifiers ?? []) {
            if (!topicIndexById.TryGetValue(subscriptionId, out var filterKey)) continue;
            if (listeners.ContainsKey(filterKey)) {
                await SafeInvokeAsync(listeners[filterKey], h => h.Handler(msg.Topic, payloadBytes));
            }
        }
    }

    #endregion
}
