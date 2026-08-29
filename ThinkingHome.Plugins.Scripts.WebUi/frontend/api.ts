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

export type ScriptListItem = v.InferOutput<typeof scriptListSchema>[number];
export type SubscriptionListItem = v.InferOutput<typeof subscriptionListSchema>[number];
export type EventList = v.InferOutput<typeof eventListSchema>;

export const getScriptList = (api: ApiClient, signal?: AbortSignal) =>
    api.get(scriptListSchema, {url: `${API}/list`, signal});

export const getScript = (api: ApiClient, id: string, signal?: AbortSignal) =>
    api.get(scriptSchema, {url: `${API}/get`, params: {id}, signal});

export const deleteScript = (api: ApiClient, id: string) =>
    api.get(anySchema, {url: `${API}/delete`, params: {id}});

export const runScript = (api: ApiClient, id: string) =>
    api.get(anySchema, {url: `${API}/execute`, params: {id}});

export const getEventList = (api: ApiClient, signal?: AbortSignal) =>
    api.get(eventListSchema, {url: `${API}/events/list`, signal});

export const getSubscriptionList = (api: ApiClient, signal?: AbortSignal) =>
    api.get(subscriptionListSchema, {url: `${API}/subscription/list`, signal});

export const addSubscription = (api: ApiClient, subscription: {scriptId: string, eventName: string, metaFilter?: string}) => {
    const params: Record<string, string> = {
        scriptId: subscription.scriptId,
        eventName: subscription.eventName,
    };

    if (subscription.metaFilter) {
        params.metaFilter = subscription.metaFilter;
    }

    return api.get(addedSubscriptionSchema, {url: `${API}/subscription/add`, params});
};

export const deleteSubscription = (api: ApiClient, subscriptionId: string) =>
    api.get(anySchema, {url: `${API}/subscription/delete`, params: {subscriptionId}});

export const saveScript = (api: ApiClient, script: {id?: string, name: string, body: string}) => {
    // текст сценария отправляем в теле запроса, а не в query string: он может быть
    // длиннее, чем допустимая длина url. Сервер читает параметры из обоих источников.
    const data = new FormData();

    if (script.id) {
        data.append('id', script.id);
    }

    data.append('name', script.name);
    data.append('body', script.body);

    return api.post(savedScriptSchema, {url: `${API}/save`, data});
};
