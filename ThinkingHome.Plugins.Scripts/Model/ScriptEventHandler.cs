using System;

namespace ThinkingHome.Plugins.Scripts.Model
{
    public class ScriptEventHandler
    {
        public Guid Id { get; set; }

        public string EventAlias { get; set; }

        public Guid UserScriptId { get; set; }
        public UserScript UserScript { get; set; }
    }
}