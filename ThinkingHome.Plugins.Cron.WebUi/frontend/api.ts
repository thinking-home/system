import * as v from 'valibot';
import type {ApiClient} from '@thinking-home/ui';

const API = '/api/cron/web-api';

export const taskListSchema = v.array(v.object({
    id: v.string(),
    name: v.string(),
    eventName: v.nullable(v.string()),
    enabled: v.boolean(),
    expression: v.string(),
    description: v.nullable(v.string()),
}));

export const expressionInfoSchema = v.object({
    valid: v.boolean(),
    description: v.nullable(v.string()),
});

export const savedTaskSchema = v.object({
    taskId: v.string(),
});

// значение ответа не используется: сервер отдает пустой ответ
const anySchema = v.unknown();

// изменяющие запросы отправляются POST-ом с параметрами в теле запроса
// (сервер читает параметры и из query string, и из формы); значения
// undefined пропускаются
const toFormData = (params: Record<string, string | undefined>): FormData => {
    const data = new FormData();

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) data.append(key, value);
    }

    return data;
};

export type CronTaskListItem = v.InferOutput<typeof taskListSchema>[number];
export type ExpressionInfo = v.InferOutput<typeof expressionInfoSchema>;

export interface CronTaskFields {
    id?: string;
    name: string;
    eventName?: string;
    enabled: boolean;
    expression: string;
}

export const getTaskList = (api: ApiClient, signal?: AbortSignal) =>
    api.get(taskListSchema, {url: `${API}/list`, signal});

export const describeExpression = (api: ApiClient, expression: string, signal?: AbortSignal) =>
    api.get(expressionInfoSchema, {url: `${API}/describe`, params: {expression}, signal});

export const saveTask = (api: ApiClient, task: CronTaskFields) =>
    api.post(savedTaskSchema, {
        url: `${API}/save`,
        data: toFormData({
            id: task.id || undefined,
            name: task.name,
            expression: task.expression,
            enabled: String(task.enabled),
            eventName: task.eventName || undefined,
        }),
    });

export const deleteTask = (api: ApiClient, id: string) =>
    api.post(anySchema, {url: `${API}/delete`, data: toFormData({id})});
