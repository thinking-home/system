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

// значение ответа не используется: сервер отдает либо пустой ответ (delete),
// либо то, что вернул сценарий (execute)
const anySchema = v.unknown();

export type ScriptListItem = v.InferOutput<typeof scriptListSchema>[number];

export const getScriptList = (api: ApiClient, signal?: AbortSignal) =>
    api.get(scriptListSchema, {url: `${API}/list`, signal});

export const getScript = (api: ApiClient, id: string, signal?: AbortSignal) =>
    api.get(scriptSchema, {url: `${API}/get`, params: {id}, signal});

export const deleteScript = (api: ApiClient, id: string) =>
    api.get(anySchema, {url: `${API}/delete`, params: {id}});

export const runScript = (api: ApiClient, id: string) =>
    api.get(anySchema, {url: `${API}/execute`, params: {id}});

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
