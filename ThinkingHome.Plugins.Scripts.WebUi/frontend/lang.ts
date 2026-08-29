import {Keyset, text} from '@thinking-home/i18n';

// Тексты по умолчанию на английском; переводы приходят с сервера
// из ресурсов плагина (Lang/ScriptsWebUiPlugin.*.resx).
export const keyset = new Keyset('en', {
    title: text('Scripts'),
    newScript: text('New script'),
    emptyList: text('There are no scripts yet'),
    name: text('Name'),
    nameRequired: text('Enter the script name'),
    code: text('Code'),
    save: text('Save'),
    run: text('Run'),
    runHint: text('Save the script to run it'),
    delete: text('Delete'),
    deleteConfirm: text('Delete script "{name}"?'),
    backToList: text('Back to the list'),
    saved: text('Script saved'),
    deleted: text('Script deleted'),
    result: text('Result'),
    errorLoad: text('Failed to load data'),
    errorSave: text('Failed to save the script'),
    errorDelete: text('Failed to delete the script'),
    errorRun: text('Failed to run the script'),
});
