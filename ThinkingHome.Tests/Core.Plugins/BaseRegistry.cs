using System.Collections.ObjectModel;
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

        [Fact]
        public void Register_DontCallMethods_WhenKeyIsNull()
        {
            var registry = new Mock<BaseRegistry<string, string>>();

            registry.Object.Register(null, "test-value");

            registry.Protected().Verify("Add", Times.Never(), ItExpr.IsAny<string>(), ItExpr.IsAny<string>());
        }

        [Fact]
        public void Register_DontCallMethods_WhenValueIsNull()
        {
            var registry = new Mock<BaseRegistry<string, string>>();

            registry.Object.Register("test-key", null);

            registry.Protected().Verify("Add", Times.Never(), ItExpr.IsAny<string>(), ItExpr.IsAny<string>());
        }

        [Fact]
        public void ContainsKey_IsTrue_WhenExistingKeyPassed()
        {
            var registry = new Mock<BaseRegistry<string, string>>();

            registry.Object.Register("test-key", "test-value");

            Assert.True(registry.Object.ContainsKey("test-key"));
        }

        [Fact]
        public void ContainsKey_IsCaseInsensitive()
        {
            var registry = new Mock<BaseRegistry<string, string>>();

            registry.Object.Register("test-key", "test-value");

            Assert.True(registry.Object.ContainsKey("TEST-KEY"));
        }

        [Fact]
        public void Indexer_ReturnsAddedValue_WhenExistingKeyPassed()
        {
            var registry = new Mock<BaseRegistry<string, string>>();

            registry.Protected()
                .Setup<string>("Add", ItExpr.IsAny<string>(), ItExpr.IsAny<string>())
                .Returns("test-value");

            registry.Object.Register("test-key", "test-value");

            Assert.Equal("test-value", registry.Object["test-key"]);
        }

        [Fact]
        public void Indexer_IsCaseInsensitive()
        {
            var registry = new Mock<BaseRegistry<string, string>>();

            registry.Protected()
                .Setup<string>("Add", ItExpr.IsAny<string>(), ItExpr.IsAny<string>())
                .Returns("test-value");

            registry.Object.Register("test-key", "test-value");

            Assert.Equal("test-value", registry.Object["TEST-KEY"]);
        }

        [Fact]
        public void IndexerShouldReturnNull_WhenKeyNotExists()
        {
            var registry = new Mock<BaseRegistry<string, string>>();

            Assert.Null(registry.Object["not-existing-key"]);
        }

        [Fact]
        public void Data_IsDictionary()
        {
            var registry = new Mock<BaseRegistry<string, int>>();

            Assert.IsType<ReadOnlyDictionary<string, int>>(registry.Object.Data);
        }
    }
}
