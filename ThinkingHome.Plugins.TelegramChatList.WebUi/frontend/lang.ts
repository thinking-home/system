import {Keyset, text} from '@thinking-home/i18n';

// Тексты по умолчанию на английском; переводы приходят с сервера
// из ресурсов плагина (Lang/TelegramChatListWebUiPlugin.*.resx).
export const keyset = new Keyset('en', {
    title: text('Telegram chats'),
    id: text('ID'),
    login: text('Login'),
    chatId: text('Chat ID'),
    firstName: text('First name'),
    lastName: text('Last name'),
    date: text('Date'),
    emptyList: text('There are no chats yet'),
    errorLoad: text('Failed to load data'),
});
