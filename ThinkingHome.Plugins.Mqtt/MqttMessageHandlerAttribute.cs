using System;

namespace ThinkingHome.Plugins.Mqtt
{
    [AttributeUsage(AttributeTargets.Method)]
    public class MqttMessageHandlerAttribute : Attribute
    {
    }
}