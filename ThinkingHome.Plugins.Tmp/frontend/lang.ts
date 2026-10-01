import {Keyset, text} from '@thinking-home/i18n';

// Тексты по умолчанию на английском; переводы приходят с сервера
// из ресурсов плагина (Lang/TmpPlugin.*.resx).
export const keyset = new Keyset('en', {
    emptyList: text('There is no data yet'),
    errorLoad: text('Failed to load data'),
    loadCancelled: text('Loading cancelled'),
});
