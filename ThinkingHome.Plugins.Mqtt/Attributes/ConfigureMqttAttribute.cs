using System;

namespace ThinkingHome.Plugins.Mqtt.Attributes;

public class ConfigureMqttAttribute : Attribute {
}

public delegate void ConfigureMqttDelegate(MqttConfigurationBuilder config);
