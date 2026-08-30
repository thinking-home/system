using System.Collections.Generic;
using ThinkingHome.Plugins.Scripts.Events;
using Xunit;

namespace ThinkingHome.Tests.Plugins.Scripts
{
    public class MetaFilterTests
    {
        [Fact]
        public void Serialize_ReturnsEmptyString_ForNullAndEmptyValues()
        {
            Assert.Equal(string.Empty, MetaFilter.Serialize(null));
            Assert.Equal(string.Empty, MetaFilter.Serialize(new Dictionary<string, string>()));
        }

        [Fact]
        public void Serialize_SortsKeys()
        {
            var filter = MetaFilter.Serialize(new Dictionary<string, string>
            {
                ["topic"] = "counter/1/value",
                ["name"] = "mqtt:counter:changed"
            });

            Assert.Equal("name=mqtt%3Acounter%3Achanged&topic=counter%2F1%2Fvalue", filter);
        }

        [Fact]
        public void ParseAndSerialize_AreSymmetric()
        {
            var values = new Dictionary<string, string>
            {
                ["name"] = "включи свет",
                ["a=b"] = "x&y",
                ["empty"] = ""
            };

            var parsed = MetaFilter.Parse(MetaFilter.Serialize(values));

            Assert.Equal(values, parsed);
        }

        [Fact]
        public void Parse_ReturnsEmptyValues_ForNullAndEmptyFilter()
        {
            Assert.Empty(MetaFilter.Parse(null));
            Assert.Empty(MetaFilter.Parse(""));
            Assert.Empty(MetaFilter.Parse("   "));
        }

        [Fact]
        public void EmptyFilter_MatchesAnyMeta()
        {
            Assert.True(MetaFilter.IsMatch(null, new Dictionary<string, string> { ["name"] = "test" }));
            Assert.True(MetaFilter.IsMatch("", new Dictionary<string, string>()));
            Assert.True(MetaFilter.IsMatch(null, null));
        }

        [Fact]
        public void Filter_Matches_WhenAllPairsPresentInMeta()
        {
            var meta = new Dictionary<string, string>
            {
                ["name"] = "mqtt:counter:changed",
                ["topic"] = "counter/1/value"
            };

            Assert.True(MetaFilter.IsMatch("name=mqtt%3Acounter%3Achanged", meta));
            Assert.True(MetaFilter.IsMatch("name=mqtt%3Acounter%3Achanged&topic=counter%2F1%2Fvalue", meta));
        }

        [Fact]
        public void Filter_DoesNotMatch_WhenValueDiffersOrKeyMissing()
        {
            var meta = new Dictionary<string, string> { ["name"] = "test" };

            Assert.False(MetaFilter.IsMatch("name=other", meta));
            Assert.False(MetaFilter.IsMatch("topic=test", meta));
            Assert.False(MetaFilter.IsMatch("name=test", null));
        }

        [Fact]
        public void Filter_IsCaseSensitive()
        {
            var meta = new Dictionary<string, string> { ["name"] = "Test" };

            Assert.False(MetaFilter.IsMatch("name=test", meta));
            Assert.False(MetaFilter.IsMatch("Name=Test", meta));
        }
    }
}
