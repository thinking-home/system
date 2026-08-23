import * as v from "valibot";
import type { GenericSchema } from "valibot";

export const parseData = function <T>(schema: GenericSchema<unknown, T>, data: unknown): T {
    return v.parse(schema, data);
}

export const MessageHubConfigSchema = v.object({
    route: v.string(),
    clientMethod: v.string(),
    serverMethod: v.string(),
    reconnectionTimeout: v.number(),
});

export type MessageHubConfig = v.InferOutput<typeof MessageHubConfigSchema>;

export const PageDefinitionSchema = v.object({
    js: v.string(),
    langId: v.string(),
});

export type PageDefinition = v.InferOutput<typeof PageDefinitionSchema>;

// цветовая схема интерфейса: её задаёт настройка плагина на сервере
export const ThemeSchema = v.picklist(['light', 'dark']);

export type Theme = v.InferOutput<typeof ThemeSchema>;

export const MetaResponseSchema = v.object({
    pages: v.record(v.string(), PageDefinitionSchema),
    config: v.object({
        lang: v.string(),
        theme: ThemeSchema,
        messageHub: MessageHubConfigSchema,
    }),
});

export const LangDataSchema = v.record(v.string(), v.string());

export const MessageHubMessageSchema = v.object({
    topic: v.string(),
    data: v.unknown(),
    guid: v.string(),
    timestamp: v.string(),
});

export type MessageHubMessage = v.InferOutput<typeof MessageHubMessageSchema>;
