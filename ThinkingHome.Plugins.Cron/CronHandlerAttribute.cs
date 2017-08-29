using System;

namespace ThinkingHome.Plugins.Cron
{
    [AttributeUsage(AttributeTargets.Method)]
    public class CronHandlerAttribute : Attribute
    {
    }
}