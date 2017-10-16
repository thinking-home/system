using ThinkingHome.Core.Plugins.Utils;
using Xunit;

namespace ThinkingHome.Tests.Core.Plugins
{
    public class ObjectSetRegistry
    {
        [Fact]
        public void ShouldStoreAllValues_WhenDuplicatedKeyPAssed()
        {
            var registry = new ObjectSetRegistry<int>();

            registry.Register("test-key", 12);
            registry.Register("test-key", 34);

            var result = registry["test-key"];

            Assert.Contains(12, result);
            Assert.Contains(34, result);
        }
    }
}
