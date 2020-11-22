namespace ThinkingHome.Plugins.Mqtt
{
    public delegate void MqttMessageHandlerDelegate(string topic, byte[] payload);
}
