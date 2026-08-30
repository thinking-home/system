namespace ThinkingHome.Plugins.NooLite
{
    /// <summary>Параметры сценарного события noolite:data:received</summary>
    public class NooLiteDataEventArgs
    {
        public byte Command { get; set; }

        public int Channel { get; set; }

        public byte Format { get; set; }

        public byte Data1 { get; set; }

        public byte Data2 { get; set; }

        public byte Data3 { get; set; }

        public byte Data4 { get; set; }
    }
}
