using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging.Abstractions;
using ThinkingHome.Plugins.Scripts.Internal;
using Xunit;

namespace ThinkingHome.Tests.Plugins.Scripts
{
    /// <summary>
    /// Проверяет контракт переменных meta и args, доступных в сценариях
    /// (объекты .NET, обернутые Jint).
    /// </summary>
    public class ScriptContextVariablesTests
    {
        private class TestArgs
        {
            public int Channel { get; set; }
            public string Room { get; set; }
        }

        private static object Execute(string body, IReadOnlyDictionary<string, string> meta, object args)
        {
            var context = new ScriptContext("test", body, null, NullLogger.Instance, TimeSpan.FromSeconds(10));

            return context.Execute(meta, args);
        }

        [Fact]
        public void Script_CanReadMetaValues_ByPropertyAndByKey()
        {
            var meta = new Dictionary<string, string> { ["name"] = "включи свет", ["topic"] = "counter/1/value" };

            Assert.Equal("включи свет", Execute("return meta.name;", meta, null));
            Assert.Equal("counter/1/value", Execute("return meta['topic'];", meta, null));
        }

        [Fact]
        public void MetaAndArgs_AreUndefined_WhenNotPassed()
        {
            Assert.Equal("undefined", Execute("return typeof meta;", null, null));
            Assert.Equal("undefined", Execute("return typeof args;", null, null));
        }

        [Fact]
        public void Script_CanReadTypedArgs()
        {
            var args = new TestArgs { Channel = 42, Room = "kitchen" };

            Assert.Equal(42, Convert.ToInt32(Execute("return args.Channel;", null, args)));
            Assert.Equal("kitchen", Execute("return args.Room;", null, args));
        }

        [Fact]
        public void Script_CanReadUserEventArgsByIndex()
        {
            var args = new object[] { "звонок", 42 };

            Assert.Equal("звонок", Execute("return args[0];", null, args));
            Assert.Equal(42, Convert.ToInt32(Execute("return args[1];", null, args)));
            Assert.Equal(2, Convert.ToInt32(Execute("return args.length;", null, args)));
        }

        [Fact]
        public void PublicExecute_PassesArgumentsAsArgsArray()
        {
            var context = new ScriptContext(
                "test", "return args[0] + args[1];", null, NullLogger.Instance, TimeSpan.FromSeconds(10));

            Assert.Equal(30, Convert.ToInt32(context.Execute(10, 20)));
        }

        [Fact]
        public void ScriptFails_WhenReservedNameIsRedeclared()
        {
            // имена meta и args зарезервированы: собственное объявление дает
            // SyntaxError, ScriptContext ловит ошибку и возвращает null
            Assert.Null(Execute("var meta = 5; return 1;", null, null));
            Assert.Null(Execute("var args = 5; return 1;", null, null));
        }
    }
}
