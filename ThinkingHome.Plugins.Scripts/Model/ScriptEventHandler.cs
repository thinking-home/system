using System;

namespace ThinkingHome.Plugins.Scripts.Model
{
    public class ScriptEventHandler
    {
        public Guid Id { get; set; }

        public string EventName { get; set; }

        /// <summary>Фильтр по meta в формате query string; null или пустая строка — без фильтра</summary>
        public string MetaFilter { get; set; }

        public Guid UserScriptId { get; set; }
        public UserScript UserScript { get; set; }
    }
}
