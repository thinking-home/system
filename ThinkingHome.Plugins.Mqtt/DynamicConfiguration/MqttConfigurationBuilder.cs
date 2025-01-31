using System;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.Mqtt.DynamicConfiguration;

public class MqttConfigurationBuilder(Type source, ObjectRegistry<MqttConfigurationBuilder.MqttListenerDefinition> items, Func<uint> getNextId)
    : BaseConfigurationBuilder<MqttConfigurationBuilder.MqttListenerDefinition>(source, items) {
    public class MqttListenerDefinition(Type source, string topicFilter, uint topicFilterId, Action<string, byte[]> handler) {
        public readonly Type Source = source;
        public readonly string TopicFilter = topicFilter;
        public readonly uint TopicFilterId = topicFilterId;
        public readonly Action<string, byte[]> Handler = handler;
    }

    public MqttConfigurationBuilder RegisterListener(string topicFilter, Action<string, byte[]> handler)
    {
        RegisterItem(topicFilter, new MqttListenerDefinition(Source, topicFilter, getNextId(), handler));

        return this;
    }
}
