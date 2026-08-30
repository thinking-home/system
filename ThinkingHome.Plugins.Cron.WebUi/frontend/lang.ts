import {Keyset, text} from '@thinking-home/i18n';

// Тексты по умолчанию на английском; переводы приходят с сервера
// из ресурсов плагина (Lang/CronWebUiPlugin.*.resx).
export const keyset = new Keyset('en', {
    title: text('Schedule'),
    newTask: text('New task'),
    emptyList: text('There are no tasks yet'),
    name: text('Name'),
    nameRequired: text('Enter the task name'),
    pattern: text('Cron expression'),
    patternHint: text('minute hour day month weekday, e.g. */5 * * * *'),
    expressionInvalid: text('Invalid cron expression'),
    event: text('Event'),
    enabled: text('Enabled'),
    disabledBadge: text('disabled'),
    add: text('Add'),
    save: text('Save'),
    cancel: text('Cancel'),
    delete: text('Delete'),
    taskAdded: text('Task added'),
    taskSaved: text('Task saved'),
    taskDeleted: text('Task deleted'),
    taskDeleteConfirm: text('Delete task "{name}"?'),
    errorLoad: text('Failed to load data'),
    errorSave: text('Failed to save the task'),
    errorDelete: text('Failed to delete the task'),
});
