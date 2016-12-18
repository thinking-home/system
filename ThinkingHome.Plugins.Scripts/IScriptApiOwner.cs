using System;

namespace ThinkingHome.Plugins.Scripts
{
    public delegate void RegisterScriptMethodDelegate(string name, Delegate method);

    public interface IScriptApiOwner
    {
        void RegisterScriptMethods(RegisterScriptMethodDelegate addScriptMethod);
    }
}