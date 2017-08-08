using System;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.Mqtt
{
    public class MqttPlugin : PluginBase
    {
        public override void InitPlugin()
        {
            Logger.LogInformation("init mqtt");
        }
    }
}