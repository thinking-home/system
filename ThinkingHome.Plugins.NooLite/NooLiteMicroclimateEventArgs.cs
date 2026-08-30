namespace ThinkingHome.Plugins.NooLite
{
    /// <summary>Параметры сценарного события noolite:microclimate-data:received</summary>
    public class NooLiteMicroclimateEventArgs
    {
        public int Channel { get; set; }

        public decimal Temperature { get; set; }

        public int? Humidity { get; set; }

        public bool LowBattery { get; set; }
    }
}
