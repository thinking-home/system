using System;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.Mqtt;

public class MqttConfigurationBuilder : BaseConfigurationBuilder<MqttConfigurationBuilder.MqttListenerDefinition> {
    public class MqttListenerDefinition(Type source, string topic, Action<string, byte[]> handler) {
        public readonly Type Source = source;
        public readonly string Topic = topic;
        public readonly Action<string, byte[]> Handler = handler;
    }

    public MqttConfigurationBuilder(Type source, ObjectRegistry<MqttListenerDefinition> items) : base(source, items)
    {
    }

    public MqttConfigurationBuilder RegisterListener(string topic, Action<string, byte[]> handler)
    {
        RegisterItem(topic, new MqttListenerDefinition(Source, topic, handler));

        return this;
    }
}
