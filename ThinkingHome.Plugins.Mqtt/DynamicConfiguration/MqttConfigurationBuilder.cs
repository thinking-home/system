using System;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.Mqtt.DynamicConfiguration;

public class MqttConfigurationBuilder(Type source, ObjectRegistry<MqttConfigurationBuilder.MqttListenerDefinition> items)
    : BaseConfigurationBuilder<MqttConfigurationBuilder.MqttListenerDefinition>(source, items) {
    public class MqttListenerDefinition(Type source, string topicFilter, Action<string, byte[]> handler) {
        public readonly Type Source = source;
        public readonly string TopicFilter = topicFilter;
        public readonly Action<string, byte[]> Handler = handler;
    }

    public MqttConfigurationBuilder RegisterListener(string topicFilter, Action<string, byte[]> handler)
    {
        RegisterItem(topicFilter, new MqttListenerDefinition(Source, topicFilter, handler));

        return this;
    }
}
