import * as v from 'valibot';
import type {ApiClient} from '@thinking-home/ui';

const API = '/api/telegram-chat-list/web-api';

// login, firstName и lastName могут отсутствовать: Telegram передает их не всегда
export const chatListSchema = v.array(v.object({
    id: v.string(),
    login: v.nullable(v.string()),
    chatId: v.number(),
    firstName: v.nullable(v.string()),
    lastName: v.nullable(v.string()),
    date: v.string(),
}));

export type TelegramChatListItem = v.InferOutput<typeof chatListSchema>[number];

export const getChatList = (api: ApiClient, signal?: AbortSignal) =>
    api.get(chatListSchema, {url: `${API}/list`, signal});
