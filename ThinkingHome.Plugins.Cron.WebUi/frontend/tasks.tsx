import * as React from 'react';
import {FC, useCallback, useEffect, useState} from 'react';
import {Anchor, Badge, Button, Code, Group, Stack, Switch, Table, Text, TextInput, Title} from '@mantine/core';
import {createModule, LogLevel, useAppContext, useKeyset, useLogger} from '@thinking-home/ui';

import {CronTaskListItem, deleteTask, describeExpression, ExpressionInfo, getTaskList, saveTask} from './api';
import {keyset} from './lang';

const DEFAULT_EXPRESSION = '* * * * *';

// пауза после ввода, по истечении которой у сервера запрашивается
// проверка и описание выражения
const DESCRIBE_DELAY = 400; // ms

const CronTaskList: FC = () => {
    const {t} = useKeyset(keyset);
    const {api, toaster} = useAppContext();
    const logger = useLogger();

    const [list, setList] = useState<CronTaskListItem[]>();

    // форма добавления и редактирования записи расписания;
    // editingId == null — добавление новой записи
    const [formVisible, setFormVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [eventName, setEventName] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [expression, setExpression] = useState(DEFAULT_EXPRESSION);

    // проверка и человекочитаемое описание выражения, полученные с сервера;
    // undefined — данных еще нет (пустое поле или запрос в пути)
    const [expressionInfo, setExpressionInfo] = useState<ExpressionInfo>();

    const fail = useCallback((message: string, signal?: AbortSignal) => (error: unknown) => {
        // отмена запроса при уходе со страницы — не ошибка
        if (signal?.aborted) return;

        logger.log(LogLevel.Error, error instanceof Error ? error.message : String(error));
        toaster.showError(message);
    }, [logger, toaster]);

    const load = useCallback((signal?: AbortSignal) => {
        getTaskList(api, signal).then(setList, fail(t('errorLoad'), signal));
    }, [api, fail, t]);

    useEffect(() => {
        const controller = new AbortController();

        load(controller.signal);

        return () => controller.abort();
    }, [load]);

    // живая проверка и описание выражения: после паузы в наборе запрашиваются
    // у сервера; ошибки запроса молча игнорируются — это только подсказка,
    // финальная валидация происходит при сохранении
    useEffect(() => {
        setExpressionInfo(undefined);

        const value = expression.trim();

        if (!formVisible || !value) return;

        const controller = new AbortController();

        const timer = setTimeout(() => {
            describeExpression(api, value, controller.signal).then(setExpressionInfo, () => {});
        }, DESCRIBE_DELAY);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [api, formVisible, expression]);

    const resetForm = useCallback(() => {
        setFormVisible(false);
        setEditingId(null);
        setName('');
        setEventName('');
        setEnabled(true);
        setExpression(DEFAULT_EXPRESSION);
    }, []);

    const startEdit = useCallback((task: CronTaskListItem) => {
        setFormVisible(true);
        setEditingId(task.id);
        setName(task.name);
        setEventName(task.eventName ?? '');
        setEnabled(task.enabled);
        setExpression(task.expression);
    }, []);

    const submit = useCallback(() => {
        if (!name.trim()) {
            toaster.showError(t('nameRequired'));
            return;
        }

        const expressionValue = expression.trim();

        // окончательно формат проверит сервер при сохранении; здесь
        // отсекается пустое поле и ошибка, уже подтвержденная сервером
        if (!expressionValue || expressionInfo?.valid === false) {
            toaster.showError(t('expressionInvalid'));
            return;
        }

        const task = {
            id: editingId ?? undefined,
            name: name.trim(),
            eventName: eventName.trim() || undefined,
            enabled,
            expression: expressionValue,
        };

        saveTask(api, task).then(
            () => {
                toaster.showSuccess(t(editingId ? 'taskSaved' : 'taskAdded'));
                resetForm();
                load();
            },
            fail(t('errorSave')),
        );
    }, [api, editingId, name, eventName, enabled, expression, expressionInfo, toaster, t, resetForm, load, fail]);

    const remove = useCallback((task: CronTaskListItem) => {
        if (!confirm(t('taskDeleteConfirm', {name: task.name}))) return;

        deleteTask(api, task.id).then(
            () => {
                toaster.showSuccess(t('taskDeleted'));
                load();
            },
            fail(t('errorDelete')),
        );
    }, [api, t, toaster, load, fail]);

    if (!list) return null;

    return (
        <>
            <Title>{t('title')}</Title>

            <Stack my="md" gap="md">
                {formVisible ? (
                    <Stack gap="sm" maw={480}>
                        <TextInput
                            label={t('name')}
                            value={name}
                            onChange={event => setName(event.currentTarget.value)}
                        />

                        <div>
                            <TextInput
                                label={t('pattern')}
                                description={t('patternHint')}
                                value={expression}
                                onChange={event => setExpression(event.currentTarget.value)}
                                error={expressionInfo?.valid === false ? t('expressionInvalid') : undefined}
                            />
                            {expressionInfo?.description ? (
                                <Text size="sm" c="dimmed" mt={4}>{expressionInfo.description}</Text>
                            ) : null}
                        </div>

                        <TextInput
                            label={t('event')}
                            value={eventName}
                            onChange={event => setEventName(event.currentTarget.value)}
                        />

                        <Switch
                            label={t('enabled')}
                            checked={enabled}
                            onChange={event => setEnabled(event.currentTarget.checked)}
                        />

                        <Group>
                            <Button onClick={submit}>{t(editingId ? 'save' : 'add')}</Button>
                            <Button variant="default" onClick={resetForm}>{t('cancel')}</Button>
                        </Group>
                    </Stack>
                ) : (
                    <Group>
                        <Button onClick={() => setFormVisible(true)}>{t('newTask')}</Button>
                    </Group>
                )}
            </Stack>

            {list.length ? (
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t('name')}</Table.Th>
                            <Table.Th>{t('pattern')}</Table.Th>
                            <Table.Th>{t('event')}</Table.Th>
                            <Table.Th/>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {list.map(task => (
                            <Table.Tr key={task.id}>
                                <Table.Td>
                                    <Group gap="xs">
                                        <Anchor component="button" type="button" onClick={() => startEdit(task)}>
                                            {task.name}
                                        </Anchor>
                                        {task.enabled ? null : <Badge color="gray">{t('disabledBadge')}</Badge>}
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Code>{task.expression}</Code>
                                    {task.description ? (
                                        <Text size="sm" c="dimmed">{task.description}</Text>
                                    ) : null}
                                </Table.Td>
                                <Table.Td>
                                    {task.eventName ? <Text>{task.eventName}</Text> : <Text c="dimmed">—</Text>}
                                </Table.Td>
                                <Table.Td>
                                    <Button onClick={() => remove(task)}>{t('delete')}</Button>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            ) : (
                <Text>{t('emptyList')}</Text>
            )}
        </>
    );
};

export default createModule(CronTaskList);
