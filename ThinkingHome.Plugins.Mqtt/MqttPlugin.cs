using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Client;
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

    #endregion

    private IMqttClient client;
    private MqttClientOptions options;
    private readonly ConcurrentDictionary<string, HashSet<string>> topicsMap = new();

    public override void InitPlugin()
    {
        var clientId = Guid.NewGuid().ToString();

        Logger.LogInformation("init MQTT client: {Url} (ID: {ClientId})", $"{Host}:{Port}", clientId);

        options = new MqttClientOptionsBuilder()
            .WithClientId(clientId)
            .WithTcpServer(Host, Port)
            .WithCredentials(Login, Password)
            .Build();

        client = new MqttFactory().CreateMqttClient();

        client.ConnectedAsync += client_Connected;
        client.DisconnectedAsync += client_Disconnected;
        client.ApplicationMessageReceivedAsync += client_ApplicationMessageReceived;
        
        // listeners
        RegisterListeners(listeners, Context);
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

    private HashSet<string> GetFiltersByTopic(string topic)
    {
        return listeners.Keys
            .Where(filter => MqttTopicFilterComparer.Compare(topic, filter) == MqttTopicFilterCompareResult.IsMatch)
            .ToHashSet();
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

    private static void RegisterListeners(
        ObjectRegistry<MqttConfigurationBuilder.MqttListenerDefinition> listeners, IServiceContext context)
    {
        var inits = context.GetAllPlugins()
            .SelectMany(p => p.FindMethods<ConfigureMqttAttribute, ConfigureMqttDelegate>())
            .ToArray();

        foreach (var (_, fn, plugin) in inits) {
            var source = plugin.GetType();

            using var configBuilder = new MqttConfigurationBuilder(source, listeners);
            fn(configBuilder);
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
        
        foreach (var topic in listeners.Keys) {
            Logger.LogInformation("Subscribe MQTT client to {Topic} topic", topic);
            var topicFilter = new MqttTopicFilterBuilder().WithTopic(topic).WithAtMostOnceQoS().Build();
            await client.SubscribeAsync(topicFilter);
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
        var payload = Encoding.UTF8.GetString(msg.PayloadSegment);

        Logger.LogDebug(
            "topic: {Topic}, payload: {Payload}, qos: {QualityOfServiceLevel}, retain: {Retain}",
            msg.Topic, payload, msg.QualityOfServiceLevel, msg.Retain);

        var payloadBytes = msg.PayloadSegment.Array;
        var matchedFilters = topicsMap.GetOrAdd(msg.Topic, GetFiltersByTopic);

        // events
        foreach (var filter in matchedFilters.Where(filter => listeners.ContainsKey(filter))) {
            await SafeInvokeAsync(listeners[filter], h => h.Handler(msg.Topic, payloadBytes));
        }
        
        scripts.EmitScriptEvent("mqtt:message:received", msg.Topic, new Buffer(payloadBytes));
    }

    #endregion
}
