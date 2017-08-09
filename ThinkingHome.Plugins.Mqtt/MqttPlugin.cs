using System;
using System.Linq;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Core.Client;
using MQTTnet.Core.Packets;
using MQTTnet.Core.Protocol;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.Mqtt
{
    public class MqttPlugin : PluginBase
    {
        #region settings

        private const string DEFAULT_HOST = "localhost";
        private const int DEFAULT_PORT = 1883;

        private bool reconnectEnabled;
        
        public string Host => Configuration.GetValue("host", DEFAULT_HOST);
        public int Port => Configuration.GetValue("port", DEFAULT_PORT);
        public string Login => Configuration["login"];
        public string Password => Configuration["password"];
        public string[] Topics => Configuration.GetValue("path", new[] { "#" });

        #endregion

        private IMqttClient client;
        
        public override void InitPlugin()
        {
            var clientId = Guid.NewGuid().ToString();
            
            Logger.LogInformation($"init MQTT client: {Host}:{Port} (ID: {{{clientId}}})");
            
            var options = new MqttClientOptions
            {
                Server = Host,
                Port = Port,
                UserName = Login,
                Password = Password,
                ClientId = clientId
            };

            client = new MqttClientFactory().CreateMqttClient(options);
            client.Connected += client_Connected;
            client.Disconnected += client_Disconnected;
            client.ApplicationMessageReceived += client_ApplicationMessageReceived;
        }

        public override void StartPlugin()
        {
            reconnectEnabled = true;
            ReConnect();
        }

        public override void StopPlugin()
        {
            reconnectEnabled = false;
            client.DisconnectAsync().Wait();
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
                            
                            var task = client.ConnectAsync();
                            task.Wait();

                            if (task.Exception != null) throw task.Exception;
                        }
                        catch (Exception ex)
                        {
                            Logger.LogWarning(ex, "connection failed");
                        }
                    }
                }
            }
        }

        private async void client_Connected(object s, EventArgs e)
        {
            Logger.LogInformation("MQTT client is connected");
            
            var filters = Topics
                .Select(t => new TopicFilter("#", MqttQualityOfServiceLevel.AtMostOnce))
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
            Logger.LogWarning($"topic: {msg.Topic}, payload: {payload}, qos: {msg.QualityOfServiceLevel}, retain: {msg.Retain}");
        }
    }
}