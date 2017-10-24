using Xunit;

namespace ThinkingHome.Tests.Plugins.TelegramBot
{
    public class TelegramBotPlugin
    {
        [Fact]
        public void CanParseCommang_WhenOneWordMessage()
        {
            var command = ThinkingHome.Plugins.TelegramBot.TelegramBotPlugin.ParseCommand("/qwe");

            Assert.Equal("qwe", command);
        }

        [Fact]
        public void CanParseCommang_WhenMultiWordMessage()
        {
            var command = ThinkingHome.Plugins.TelegramBot.TelegramBotPlugin.ParseCommand("/qwert lfklll");

            Assert.Equal("qwert", command);
        }

        [Fact]
        public void CanParseCommang_WhenMultiLineMessage()
        {
            var command = ThinkingHome.Plugins.TelegramBot.TelegramBotPlugin.ParseCommand("/aaa lfklll\n/21r12 r2fr23f");

            Assert.Equal("aaa", command);
        }

        [Fact]
        public void CanParseCommang_WhenMessageHasStartSpaces()
        {
            var command = ThinkingHome.Plugins.TelegramBot.TelegramBotPlugin.ParseCommand("  \n  /xxx ffff");

            Assert.Equal("xxx", command);
        }

        [Fact]
        public void CommandShouldBeEmpty_WhenIsNotParsed()
        {
            var command = ThinkingHome.Plugins.TelegramBot.TelegramBotPlugin.ParseCommand("qwert");

            Assert.Equal(string.Empty, command);
        }

        [Fact]
        public void CommandCanContainsProperSymbols()
        {
            var command = ThinkingHome.Plugins.TelegramBot.TelegramBotPlugin.ParseCommand("/qw_er-t12");

            Assert.Equal("qw_er-t12", command);
        }
    }
}