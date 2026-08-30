using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts.Attributes;
using ThinkingHome.Plugins.Scripts.Events;
using ThinkingHome.Plugins.Scripts.Internal;
using ThinkingHome.Plugins.Scripts.Model;

namespace ThinkingHome.Plugins.Scripts
{
    public class ScriptsPlugin(DatabasePlugin database) : PluginBase {
        /// <summary>Название пользовательского события (события с динамическим именем в meta)</summary>
        public const string UserEventName = "scripts:user-event";

        /// <summary>Ключ словаря meta, в котором передается имя пользовательского события</summary>
        public const string UserEventNameMetaKey = "name";

        private const int DEFAULT_EXECUTION_TIMEOUT_SECONDS = 60;

        private static readonly IReadOnlyDictionary<string, string> emptyMeta = new Dictionary<string, string>();

        private object host;

        private readonly ObjectRegistry<Delegate> methods = new ObjectRegistry<Delegate>();

        private readonly ObjectRegistry<ScriptEventDefinition> events = new ObjectRegistry<ScriptEventDefinition>();

        private ScriptEventEmitter<object[]> userEventEmitter;

        // максимальное время выполнения сценария; 0 или отрицательное значение отключает таймаут
        private TimeSpan ExecutionTimeout => TimeSpan.FromSeconds(
            Configuration["executionTimeout"].ParseInt() ?? DEFAULT_EXECUTION_TIMEOUT_SECONDS);

        public override void InitPlugin()
        {
            // регистрируем методы плагинов
            Context.GetAllPlugins()
                .SelectMany(plugin => plugin.FindMethods<ScriptCommandAttribute, Delegate>())
                .ToObjectRegistry(methods, mi => mi.Meta.Alias, mi => mi.Method);

            methods.ForEach((name, method) => Logger.LogInformation("register script method: {Name}", name));

            // регистрируем события плагинов
            RegisterEvents();

            events.ForEach((name, definition) => Logger.LogInformation(
                "register script event: {Name} ({PluginType})", name, definition.Source.FullName));

            // создаем объект host
            host = new
            {
                scripts = new ScriptMethodContainer<Func<object[], object>>(CreateScriptDelegateByName),
                api = new ScriptMethodContainer<Delegate>(GetMethodDelegate),
                log = new ScriptLogger(Logger),
                emit = new Action<string, object[]>(EmitUserEvent)
            };
        }

        [DbModelBuilder]
        public void InitModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserScript>(cfg => cfg.ToTable("Scripts_UserScript"));
            modelBuilder.Entity<ScriptEventHandler>(cfg => cfg.ToTable("Scripts_EventHandler"));
        }

        [ConfigureScriptEvents]
        public void RegisterUserEvent(ScriptEventsConfigurationBuilder config)
        {
            userEventEmitter = config.RegisterEvent<object[]>(UserEventName);
        }

        #region public API

        public object ExecuteScript(string body, params object[] args)
        {
            return CreateScriptDelegate(null, body)(args);
        }

        public object ExecuteScript(UserScript script, params object[] args)
        {
            return CreateScriptDelegate(script.Name, script.Body)(args);
        }

        public object ExecuteScriptByName(string name, params object[] args)
        {
            return CreateScriptDelegateByName(name)(args);
        }

        /// <summary>
        /// Инициировать пользовательское событие. Имя события попадает
        /// в meta (ключ "name"), аргументы передаются в обработчики как есть.
        /// </summary>
        public void EmitUserEvent(string name, params object[] args)
        {
            EmitUserEvent(name, null, args);
        }

        /// <summary>
        /// Инициировать пользовательское событие с дополнительными значениями meta.
        /// Значение с ключом "name" перезаписывается именем события.
        /// </summary>
        public void EmitUserEvent(string name, IReadOnlyDictionary<string, string> meta, params object[] args)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("User event name must be a non-empty string", nameof(name));
            }

            var fullMeta = meta == null
                ? new Dictionary<string, string>()
                : meta.ToDictionary(pair => pair.Key, pair => pair.Value);

            fullMeta[UserEventNameMetaKey] = name;

            userEventEmitter(args ?? [], fullMeta);
        }

        public ScriptEventDefinition[] GetRegisteredEvents()
        {
            return events.Data.Values.OrderBy(definition => definition.Name, StringComparer.Ordinal).ToArray();
        }

        #endregion

        #region private

        private void RegisterEvents()
        {
            var inits = Context.GetAllPlugins()
                .SelectMany(plugin => plugin.FindMethods<ConfigureScriptEventsAttribute, ConfigureScriptEventsDelegate>());

            foreach (var (_, fn, plugin) in inits)
            {
                using var configBuilder = new ScriptEventsConfigurationBuilder(plugin.GetType(), events, EmitScriptEvent);
                fn(configBuilder);
            }
        }

        private void EmitScriptEvent(ScriptEventDefinition definition, object args, IReadOnlyDictionary<string, string> meta)
        {
            Logger.LogDebug("execute script event handlers ({EventName})", definition.Name);

            var eventMeta = meta ?? emptyMeta;

            using var session = database.OpenSession();

            // фильтрация по meta выполняется в памяти: фильтр хранится сериализованным
            var handlers = session.Set<ScriptEventHandler>()
                .Where(h => h.EventName == definition.Name)
                .Select(h => new { h.MetaFilter, h.UserScript })
                .ToList();

            var subscribed = handlers
                .Where(h => MetaFilter.IsMatch(h.MetaFilter, eventMeta))
                .Select(h => h.UserScript)
                .ToList();

            _ = SafeInvokeAsync(subscribed, s => CreateScriptContext(s.Name, s.Body).Execute(eventMeta, args));
        }

        private ScriptContext CreateScriptContext(string name, string body)
        {
            return new ScriptContext(name, body, host, Logger, ExecutionTimeout);
        }

        private Func<object[], object> CreateScriptDelegate(string name, string body)
        {
            return CreateScriptContext(name, body).Execute;
        }

        private Func<object[], object> CreateScriptDelegateByName(string name)
        {
            try
            {
                using (var session = database.OpenSession())
                {
                    var script = session.Set<UserScript>().Single(s => s.Name == name);
                    return CreateScriptDelegate(script.Name, script.Body);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(new EventId(), ex, "Can't find script: {Name}", name);
                return null;
            }
        }

        private Delegate GetMethodDelegate(string name)
        {
            try
            {
                return methods[name];
            }
            catch (Exception ex)
            {
                Logger.LogError(new EventId(), ex, "Can't find method: {Name}", name);
                return null;
            }
        }

        #endregion
    }
}
