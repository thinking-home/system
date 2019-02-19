using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Scripts.Attributes;
using ThinkingHome.Plugins.Timer;
using Buffer = ThinkingHome.Plugins.Scripts.Buffer;

namespace ThinkingHome.Plugins.Mqtt
{
    public class MqttPlugin : PluginBase
    {
        #region settings

        private const string DEFAULT_HOST = "localhost";
        private const int DEFAULT_PORT = 1883;

        private bool reconnectEnabled;
        static readonly MqttFactory Factory = new MqttFactory();
        private IMqttClientOptions options;

        private List<MqttMessageHandlerDelegate> handlers;

        public string Host => Configuration.GetValue("host", DEFAULT_HOST);
        public int Port => Configuration.GetValue("port", DEFAULT_PORT);
        public string Login => Configuration["login"];
        public string Password => Configuration["password"];
        public string[] Topics => Configuration.GetSection("topics").Get<string[]>() ?? new[] { "#" };


        #endregion

        private IMqttClient client;

        public override void InitPlugin()
        {
            var clientId = Guid.NewGuid().ToString();

            Logger.LogInformation($"init MQTT client: {Host}:{Port} (ID: {{{clientId}}})");


            options = new MqttClientOptionsBuilder()
                .WithTcpServer(Host, Port)
                .WithClientId(clientId)
                .WithCredentials(Login, Password)
                .Build();


            client = Factory.CreateMqttClient();
            client.Connected += client_Connected;
            client.Disconnected += client_Disconnected;
            client.ApplicationMessageReceived += client_ApplicationMessageReceived;

            handlers = RegisterHandlers();
        }

        public override void StartPlugin()
        {
            reconnectEnabled = true;
            ReConnect();
        }

        public override void StopPlugin()
        {
            reconnectEnabled = false;

            if (client.IsConnected)
            {
                lock (client)
                {
                    if (client.IsConnected)
                    {
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

        public void Publish(string topic, byte[] payload, bool retain = false)
        {
            var msg = new MqttApplicationMessage() { Payload = payload, Topic = topic, QualityOfServiceLevel = MqttQualityOfServiceLevel.AtLeastOnce, Retain = retain };

            var ex = client.PublishAsync(msg).Exception;

            if (ex != null)
            {
                throw ex;
            }
        }

        #region private

        private List<MqttMessageHandlerDelegate> RegisterHandlers()
        {
            var list = new List<MqttMessageHandlerDelegate>();

            foreach (var plugin in Context.GetAllPlugins())
            {
                var pluginType = plugin.GetType();

                foreach (var mi in plugin.FindMethods<MqttMessageHandlerAttribute, MqttMessageHandlerDelegate>())
                {
                    Logger.LogInformation($"register mqtt message handler: \"{mi.Method.Method.Name}\" ({pluginType.FullName})");
                    list.Add(mi.Method);
                }
            }

            return list;
        }

        private void ReConnect()
        {
            if (client != null && !client.IsConnected && reconnectEnabled)
            {
                lock (client)
                {
                    if (client != null && !client.IsConnected && reconnectEnabled)
                    {
                        try
                        {
                            Logger.LogInformation("connect to MQTT broker");

                            var task = client.ConnectAsync(options);
                            task.Wait();

                            if (task.Exception != null) throw task.Exception;
                        }
                        catch (Exception ex)
                        {
                            Logger.LogWarning(ex.Message);
                        }
                    }
                }
            }
        }

        private async void client_Connected(object s, EventArgs e)
        {
            Logger.LogInformation("MQTT client is connected");

            Logger.LogInformation($"Subscribe: {string.Join(", ", Topics)}");

            var filters = Topics
                .Select(topic => new TopicFilter(topic, MqttQualityOfServiceLevel.AtMostOnce))
                .ToArray();

            await client.SubscribeAsync(filters);

            Logger.LogInformation("MQTT client is subscribed");
        }

        private void client_Disconnected(object s, EventArgs e)
        {
            Logger.LogInformation("MQTT connection closed");
        }

        private void client_ApplicationMessageReceived(object sender, MqttApplicationMessageReceivedEventArgs e)
        {
            var msg = e.ApplicationMessage;
            var payload = Encoding.UTF8.GetString(msg.Payload);

            Logger.LogDebug($"topic: {msg.Topic}, payload: {payload}, qos: {msg.QualityOfServiceLevel}, retain: {msg.Retain}");

            // events
            SafeInvoke(handlers, h => h(msg.Topic, msg.Payload), true);

            Context.Require<ScriptsPlugin>().EmitScriptEvent("mqtt:message:received", msg.Topic, new Buffer(msg.Payload));
        }

        #endregion
    }
}
