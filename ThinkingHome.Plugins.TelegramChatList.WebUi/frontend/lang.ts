import {Keyset, text} from '@thinking-home/i18n';

// Тексты по умолчанию на английском; переводы приходят с сервера
// из ресурсов плагина (Lang/TelegramChatListWebUiPlugin.*.resx).
export const keyset = new Keyset('en', {
    title: text('Telegram chats'),
    chatId: text('Chat ID'),
    login: text('Login'),
    firstName: text('First name'),
    lastName: text('Last name'),
    date: text('Date'),
    id: text('Id'),
    emptyList: text('There are no saved chats yet'),
    errorLoad: text('Failed to load data'),
});
