using System;

namespace ThinkingHome.Plugins.Mqtt.DynamicConfiguration;

public class ConfigureMqttAttribute : Attribute {
}

public delegate void ConfigureMqttDelegate(MqttConfigurationBuilder config);
