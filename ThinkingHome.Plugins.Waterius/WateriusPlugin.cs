using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Mqtt;
using ThinkingHome.Plugins.Mqtt.DynamicConfiguration;
using ThinkingHome.Plugins.Waterius.Model;

namespace ThinkingHome.Plugins.Waterius;

public class WateriusPlugin : PluginBase {
    
    [DbModelBuilder]
    public void InitModel(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MeterData>(cfg => cfg.ToTable("Waterius_MeterData"));
    }

    [ConfigureMqtt]
    public void WateriusListeners(MqttConfigurationBuilder config)
    {
        config.RegisterListener(MqttTopic?.Trim('/') + "/#", HandleMqttMessage);
    }

    private void HandleMqttMessage(string topic, byte[] payload)
    {
        var str = Encoding.UTF8.GetString(payload);

        Logger.LogInformation($"{topic}: {str}");
    }
    public string? MqttTopic => Configuration["mqttTopic"];
    
    private readonly MqttPlugin mqttPlugin;

    public WateriusPlugin(MqttPlugin mqttPlugin)
    {
        this.mqttPlugin = mqttPlugin;
    }

    public override void InitPlugin()
    {
        if (string.IsNullOrWhiteSpace(MqttTopic)) {
            Logger.LogWarning("MQTT Topic is undefined");
        }
        else {
            Logger.LogInformation("Listen to waterius in topic: {MqttTopic}...", MqttTopic);
        }
    }
}
