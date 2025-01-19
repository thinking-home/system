using System;

namespace ThinkingHome.Plugins.Mqtt.Attributes;

[AttributeUsage(AttributeTargets.Method)]
public class MqttMessageHandlerAttribute : Attribute {
}

public delegate void MqttMessageHandlerDelegate(string topic, byte[] payload);
