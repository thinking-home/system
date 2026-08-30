using System;
using System.Globalization;
using System.Linq;
using CronExpressionDescriptor;
using NCrontab;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Cron.Model;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.WebServer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.Cron.WebApi
{
    public class CronWebApiPlugin(DatabasePlugin database, CronPlugin cron) : PluginBase {
        private object ToApiModel(CronTask task)
        {
            return new
            {
                id = task.Id,
                name = task.Name,
                eventName = task.EventName,
                enabled = task.Enabled,
                expression = task.Expression,
                description = Describe(task.Expression)
            };
        }

        /// <summary>
        /// Человекочитаемое описание выражения cron на языке системы (переводы —
        /// стандартные satellite assemblies пакета CronExpressionDescriptor).
        /// null — выражение некорректно или описание построить не удалось.
        /// </summary>
        private static string Describe(string expression)
        {
            // описание строится только для выражений, которые понимает
            // исполняющий парсер (NCrontab)
            if (expression == null || CrontabSchedule.TryParse(expression) == null) return null;

            try
            {
                return ExpressionDescriptor.GetDescription(expression, new Options
                {
                    Locale = CultureInfo.CurrentUICulture.Name,
                    Use24HourTimeFormat = true
                });
            }
            catch (Exception)
            {
                return null;
            }
        }
        
        [ConfigureWebServer]
        public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
        {
            config
                .RegisterDynamicResource("/api/cron/web-api/list", GetTaskList)
                .RegisterDynamicResource("/api/cron/web-api/get", LoadTask)
                .RegisterDynamicResource("/api/cron/web-api/save", SaveTask)
                .RegisterDynamicResource("/api/cron/web-api/delete", DeleteTask)
                .RegisterDynamicResource("/api/cron/web-api/describe", DescribeExpression);
        }

        private HttpHandlerResult DescribeExpression(HttpRequestParams request)
        {
            var expression = request.GetRequiredString("expression").Trim();
            var valid = CrontabSchedule.TryParse(expression) != null;

            return HttpHandlerResult.Json(new
            {
                valid,
                description = valid ? Describe(expression) : null
            });
        }

        private HttpHandlerResult GetTaskList(HttpRequestParams request)
        {
            using var session = database.OpenSession();
            var list = session.Set<CronTask>()
                .OrderBy(e => e.Name)
                .Select(ToApiModel)
                .ToArray();

            return HttpHandlerResult.Json(list);
        }

        private HttpHandlerResult LoadTask(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using var session = database.OpenSession();
            var task = session.Set<CronTask>().Single(x => x.Id == id);

            return HttpHandlerResult.Json(ToApiModel(task));
        }

        private HttpHandlerResult SaveTask(HttpRequestParams request)
        {
            var id = request.GetGuid("id");
            var name = request.GetRequiredString("name");
            var eventName = request.GetString("eventName");
            var expression = request.GetRequiredString("expression").Trim();
            var enabled = request.GetRequiredBool("enabled");

            // формат проверяется тем же парсером, который исполняет расписание;
            // некорректное выражение не должно попасть в БД
            if (CrontabSchedule.TryParse(expression) == null)
            {
                throw new HttpHandlerException(StatusCode.BadRequest, "invalid cron expression");
            }

            using var session = database.OpenSession();
            
            CronTask task;

            if (id.HasValue)
            {
                task = session.Set<CronTask>().Single(s => s.Id == id.Value);
            }
            else
            {
                task = new CronTask { Id = Guid.NewGuid() };
                session.Set<CronTask>().Add(task);
            }

            task.Name = name;
            task.EventName = eventName;
            task.Enabled = enabled;
            task.Expression = expression;
            session.SaveChanges();

            // reset cron event cache
            cron.ReloadTasks();

            return HttpHandlerResult.Json(new { taskId = task.Id });
        }

        private HttpHandlerResult DeleteTask(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using var session = database.OpenSession();
            var task = session.Set<CronTask>().Single(s => s.Id == id);

            session.Set<CronTask>().Remove(task);
            session.SaveChanges();

            // reset cron event cache
            cron.ReloadTasks();

            return null;
        }
    }
}
