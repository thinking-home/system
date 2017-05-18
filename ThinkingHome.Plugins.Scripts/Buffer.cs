using System;
using System.Text;
namespace ThinkingHome.Plugins.Scripts
{
    public class Buffer
    {
        private readonly byte[] bytes;

        public Buffer(byte[] bytes)
        {
            this.bytes = bytes;
        }

        public string ToUtf8String() {
            return Encoding.UTF8.GetString(bytes);
        }

        public string ToBase64String() {
            return Convert.ToBase64String(bytes);
        }

        public byte[] GetBytes()
        {
            return bytes.Clone() as byte[];
        }
    }
}
