import * as v from 'valibot';
import type {ApiClient} from '@thinking-home/ui';

const API = '/api/scripts/web-api';

export const scriptListSchema = v.array(v.object({
    id: v.string(),
    name: v.string(),
}));

export const scriptSchema = v.object({
    id: v.string(),
    name: v.string(),
    body: v.string(),
});

export const savedScriptSchema = v.object({
    scriptId: v.string(),
});

export const subscriptionListSchema = v.array(v.object({
    id: v.string(),
    scriptId: v.string(),
    scriptName: v.string(),
    eventName: v.string(),
    metaFilter: v.nullable(v.string()),
}));

export const eventListSchema = v.object({
    events: v.array(v.object({
        name: v.string(),
    })),
    userEvent: v.object({
        name: v.string(),
        metaKey: v.string(),
    }),
});

export const addedSubscriptionSchema = v.object({
    subscriptionId: v.string(),
});

// значение ответа не используется: сервер отдает либо пустой ответ (delete),
// либо то, что вернул сценарий (execute)
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

export type ScriptListItem = v.InferOutput<typeof scriptListSchema>[number];
export type SubscriptionListItem = v.InferOutput<typeof subscriptionListSchema>[number];
export type EventList = v.InferOutput<typeof eventListSchema>;

export const getScriptList = (api: ApiClient, signal?: AbortSignal) =>
    api.get(scriptListSchema, {url: `${API}/list`, signal});

export const getScript = (api: ApiClient, id: string, signal?: AbortSignal) =>
    api.get(scriptSchema, {url: `${API}/get`, params: {id}, signal});

export const deleteScript = (api: ApiClient, id: string) =>
    api.post(anySchema, {url: `${API}/delete`, data: toFormData({id})});

export const runScript = (api: ApiClient, id: string) =>
    api.post(anySchema, {url: `${API}/execute`, data: toFormData({id})});

export const getEventList = (api: ApiClient, signal?: AbortSignal) =>
    api.get(eventListSchema, {url: `${API}/events/list`, signal});

export const getSubscriptionList = (api: ApiClient, signal?: AbortSignal) =>
    api.get(subscriptionListSchema, {url: `${API}/subscription/list`, signal});

export const addSubscription = (api: ApiClient, subscription: {scriptId: string, eventName: string, metaFilter?: string}) =>
    api.post(addedSubscriptionSchema, {
        url: `${API}/subscription/add`,
        data: toFormData({
            scriptId: subscription.scriptId,
            eventName: subscription.eventName,
            metaFilter: subscription.metaFilter || undefined,
        }),
    });

export const deleteSubscription = (api: ApiClient, subscriptionId: string) =>
    api.post(anySchema, {url: `${API}/subscription/delete`, data: toFormData({subscriptionId})});

export const saveScript = (api: ApiClient, script: {id?: string, name: string, body: string}) =>
    // текст сценария в том числе поэтому передается в теле запроса:
    // он может быть длиннее, чем допустимая длина url
    api.post(savedScriptSchema, {
        url: `${API}/save`,
        data: toFormData({
            id: script.id || undefined,
            name: script.name,
            body: script.body,
        }),
    });
