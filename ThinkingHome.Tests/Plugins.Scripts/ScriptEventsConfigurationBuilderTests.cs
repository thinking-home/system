using System;
using System.Collections.Generic;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.Scripts.Events;
using Xunit;

namespace ThinkingHome.Tests.Plugins.Scripts
{
    public class ScriptEventsConfigurationBuilderTests
    {
        private class FakePlugin;

        private class TestParams;

        [Fact]
        public void RegisterEvent_AddsDefinitionIntoRegistry()
        {
            var registry = new ObjectRegistry<ScriptEventDefinition>();
            using var builder = new ScriptEventsConfigurationBuilder(typeof(FakePlugin), registry, (_, _, _) => { });

            builder.RegisterEvent("test:event");
            builder.RegisterEvent<TestParams>("test:typed-event");

            Assert.Equal(typeof(FakePlugin), registry["test:event"].Source);
            Assert.Null(registry["test:event"].ArgsType);
            Assert.Equal(typeof(TestParams), registry["test:typed-event"].ArgsType);
        }

        [Fact]
        public void Emitter_PassesDefinitionParamsAndMetaIntoEmitCallback()
        {
            var registry = new ObjectRegistry<ScriptEventDefinition>();

            ScriptEventDefinition actualDefinition = null;
            object actualParams = null;
            IReadOnlyDictionary<string, string> actualMeta = null;

            using var builder = new ScriptEventsConfigurationBuilder(typeof(FakePlugin), registry, (definition, parameters, meta) =>
            {
                actualDefinition = definition;
                actualParams = parameters;
                actualMeta = meta;
            });

            var emit = builder.RegisterEvent<TestParams>("test:event");

            var expectedParams = new TestParams();
            var expectedMeta = new Dictionary<string, string> { ["topic"] = "moo" };

            emit(expectedParams, expectedMeta);

            Assert.Equal("test:event", actualDefinition?.Name);
            Assert.Same(expectedParams, actualParams);
            Assert.Same(expectedMeta, actualMeta);
        }

        [Fact]
        public void RegisterEvent_ThrowsException_WhenNameIsEmpty()
        {
            var registry = new ObjectRegistry<ScriptEventDefinition>();
            using var builder = new ScriptEventsConfigurationBuilder(typeof(FakePlugin), registry, (_, _, _) => { });

            Assert.Throws<ArgumentException>(() => builder.RegisterEvent(null));
            Assert.Throws<ArgumentException>(() => builder.RegisterEvent("  "));
        }

        [Fact]
        public void RegisterEvent_ThrowsException_WhenNameIsDuplicated()
        {
            var registry = new ObjectRegistry<ScriptEventDefinition>();
            using var builder = new ScriptEventsConfigurationBuilder(typeof(FakePlugin), registry, (_, _, _) => { });

            builder.RegisterEvent("test:event");

            Assert.ThrowsAny<Exception>(() => builder.RegisterEvent("test:event"));

            // ключи реестра не различают регистр
            Assert.ThrowsAny<Exception>(() => builder.RegisterEvent<TestParams>("TEST:EVENT"));
        }

        [Fact]
        public void RegisterEvent_ThrowsException_WhenBuilderIsDisposed()
        {
            var registry = new ObjectRegistry<ScriptEventDefinition>();
            var builder = new ScriptEventsConfigurationBuilder(typeof(FakePlugin), registry, (_, _, _) => { });

            builder.Dispose();

            Assert.Throws<InvalidOperationException>(() => builder.RegisterEvent("test:event"));
        }
    }
}
