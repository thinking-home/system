using System;
using ThinkingHome.Core.Plugins.Utils;
using Xunit;

namespace ThinkingHome.Tests.Core.Plugins
{
    public class ObjectRegistry
    {
        [Fact]
        public void ThrowException_WhenDuplicatedKeyPassed()
        {
            var registry = new ObjectRegistry<int>();

            registry.Register("test", 123);

            Assert.ThrowsAny<Exception>(() => registry.Register("test", 456));
        }
    }
}
