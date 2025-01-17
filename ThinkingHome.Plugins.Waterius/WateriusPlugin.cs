using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.Waterius;

public class WateriusPlugin : PluginBase {
    public string? MqttTopic => Configuration["mqttTopic"];

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
