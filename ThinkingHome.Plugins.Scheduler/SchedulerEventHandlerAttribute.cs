using System;

namespace ThinkingHome.Plugins.Scheduler
{
    [AttributeUsage(AttributeTargets.Method)]
    public class SchedulerEventHandlerAttribute : Attribute
    {
    }
}