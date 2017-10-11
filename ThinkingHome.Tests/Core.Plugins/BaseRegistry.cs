using Moq;
using Moq.Protected;
using ThinkingHome.Core.Plugins.Utils;
using Xunit;

namespace ThinkingHome.Tests.Core.Plugins
{
    public class BaseRegistry
    {
        [Fact]
        public void Register_CallsAddMethod()
        {
            var registry = new Mock<BaseRegistry<string, string>>();

            registry.Object.Register("test-key", "test-value");

            registry.Protected().Verify("Add", Times.Once(), "test-key", "test-value");
        }

        [Fact]
        public void Register_CallsUpdateMethod_WhenPassedDuplicatedKey()
        {
            var registry = new Mock<BaseRegistry<string, string>>();

            registry.Protected()
                .Setup<string>("Add", ItExpr.IsAny<string>(), ItExpr.IsAny<string>())
                .Returns("old-value");

            registry.Object.Register("test-key", "old-value");
            registry.Object.Register("test-key", "new-value");

            registry.Protected().Verify("Update", Times.Once(), "test-key", "old-value", "new-value");
        }
    }
}