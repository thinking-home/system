import * as React from 'react';
import {FC, useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Anchor, Badge, Button, Code, Group, Input, Select, Stack, Table, Text, TextInput, Title} from '@mantine/core';
import {createModule, LogLevel, useAppContext, useKeyset, useLogger} from '@thinking-home/ui';

import {
    addSubscription,
    deleteSubscription,
    EventList,
    getEventList,
    getScriptList,
    getSubscriptionList,
    ScriptListItem,
    SubscriptionListItem,
} from './api';
import {MetaFilterRow, parseMetaFilter, serializeMetaFilter} from './metafilter';
import {keyset} from './lang';

const LIST_URL = '/scripts';
const editorUrl = (id: string) => `/scripts/edit?id=${id}`;

const emptyRow = (): MetaFilterRow => ({key: '', value: ''});

const SubscriptionList: FC = () => {
    const {t} = useKeyset(keyset);
    const {api, toaster} = useAppContext();
    const logger = useLogger();

    const [subscriptions, setSubscriptions] = useState<SubscriptionListItem[]>();
    const [scripts, setScripts] = useState<ScriptListItem[]>();
    const [events, setEvents] = useState<EventList>();

    // форма добавления подписки
    const [formVisible, setFormVisible] = useState(false);
    const [scriptId, setScriptId] = useState<string | null>(null);
    const [eventName, setEventName] = useState<string | null>(null);

    // значение фильтра по имени пользовательского события хранится отдельно
    // от остальных строк: его строка закреплена в начале таблицы
    const [customName, setCustomName] = useState('');
    const [rows, setRows] = useState<MetaFilterRow[]>([]);

    const fail = useCallback((message: string, signal?: AbortSignal) => (error: unknown) => {
        // отмена запроса при уходе со страницы — не ошибка
        if (signal?.aborted) return;

        logger.log(LogLevel.Error, error instanceof Error ? error.message : String(error));
        toaster.showError(message);
    }, [logger, toaster]);

    const load = useCallback((signal?: AbortSignal) => {
        getSubscriptionList(api, signal).then(setSubscriptions, fail(t('errorLoad'), signal));
    }, [api, fail, t]);

    useEffect(() => {
        const controller = new AbortController();
        const {signal} = controller;

        load(signal);
        getScriptList(api, signal).then(setScripts, fail(t('errorLoad'), signal));
        getEventList(api, signal).then(setEvents, fail(t('errorLoad'), signal));

        return () => controller.abort();
    }, [api, load, fail, t]);

    const resetForm = useCallback(() => {
        setFormVisible(false);
        setScriptId(null);
        setEventName(null);
        setCustomName('');
        setRows([]);
    }, []);

    const setRow = useCallback((index: number, row: MetaFilterRow) => {
        setRows(prev => prev.map((el, i) => (i === index ? row : el)));
    }, []);

    const removeRow = useCallback((index: number) => {
        setRows(prev => prev.filter((_, i) => i !== index));
    }, []);

    const submit = useCallback(() => {
        if (!events) return;

        if (!scriptId) {
            toaster.showError(t('scriptRequired'));
            return;
        }

        if (!eventName) {
            toaster.showError(t('eventRequired'));
            return;
        }

        const isUserEvent = eventName === events.userEvent.name;

        if (isUserEvent && !customName.trim()) {
            toaster.showError(t('customNameRequired'));
            return;
        }

        const filterRows = [
            ...(isUserEvent ? [{key: events.userEvent.metaKey, value: customName.trim()}] : []),
            ...rows.map(({key, value}) => ({key: key.trim(), value})),
        ];

        if (filterRows.some(row => !row.key)) {
            toaster.showError(t('metaKeyRequired'));
            return;
        }

        const keys = new Set(filterRows.map(row => row.key));

        if (keys.size !== filterRows.length) {
            toaster.showError(t('metaKeyDuplicated'));
            return;
        }

        addSubscription(api, {scriptId, eventName, metaFilter: serializeMetaFilter(filterRows)}).then(
            () => {
                toaster.showSuccess(t('subscriptionAdded'));
                resetForm();
                load();
            },
            fail(t('errorAddSubscription')),
        );
    }, [api, events, scriptId, eventName, customName, rows, toaster, t, resetForm, load, fail]);

    const remove = useCallback((subscription: SubscriptionListItem) => {
        const message = t('subscriptionDeleteConfirm', {
            script: subscription.scriptName,
            event: subscription.eventName,
        });

        if (!confirm(message)) return;

        deleteSubscription(api, subscription.id).then(
            () => {
                toaster.showSuccess(t('subscriptionDeleted'));
                load();
            },
            fail(t('errorDeleteSubscription')),
        );
    }, [api, t, toaster, load, fail]);

    if (!subscriptions || !scripts || !events) return null;

    const registeredNames = new Set(events.events.map(event => event.name));
    const isUserEvent = eventName === events.userEvent.name;
    const showFilterTable = isUserEvent || rows.length > 0;

    return (
        <>
            <Title>{t('subscriptionsTitle')}</Title>

            <Stack my="md" gap="md">
                <Anchor component={Link} to={LIST_URL}>{t('backToList')}</Anchor>

                {formVisible ? (
                    <Stack gap="sm">
                        <Select
                            label={t('script')}
                            data={scripts.map(script => ({value: script.id, label: script.name}))}
                            value={scriptId}
                            onChange={setScriptId}
                            searchable
                        />

                        <Select
                            label={t('event')}
                            data={events.events.map(event => event.name)}
                            value={eventName}
                            onChange={setEventName}
                            searchable
                        />

                        <Input.Wrapper label={t('metaFilter')}>
                            {showFilterTable ? (
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>{t('metaKey')}</Table.Th>
                                            <Table.Th>{t('metaValue')}</Table.Th>
                                            <Table.Th/>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {isUserEvent ? (
                                            <Table.Tr>
                                                <Table.Td>
                                                    <TextInput value={events.userEvent.metaKey} disabled/>
                                                </Table.Td>
                                                <Table.Td>
                                                    <TextInput
                                                        value={customName}
                                                        onChange={event => setCustomName(event.currentTarget.value)}
                                                    />
                                                </Table.Td>
                                                <Table.Td/>
                                            </Table.Tr>
                                        ) : null}
                                        {rows.map((row, index) => (
                                            <Table.Tr key={index}>
                                                <Table.Td>
                                                    <TextInput
                                                        value={row.key}
                                                        onChange={event => setRow(index, {...row, key: event.currentTarget.value})}
                                                    />
                                                </Table.Td>
                                                <Table.Td>
                                                    <TextInput
                                                        value={row.value}
                                                        onChange={event => setRow(index, {...row, value: event.currentTarget.value})}
                                                    />
                                                </Table.Td>
                                                <Table.Td>
                                                    <Button variant="subtle" onClick={() => removeRow(index)}>
                                                        {t('delete')}
                                                    </Button>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            ) : null}

                            <Button variant="default" mt="xs" onClick={() => setRows(prev => [...prev, emptyRow()])}>
                                {t('addRow')}
                            </Button>
                        </Input.Wrapper>

                        <Group>
                            <Button onClick={submit}>{t('add')}</Button>
                            <Button variant="default" onClick={resetForm}>{t('cancel')}</Button>
                        </Group>
                    </Stack>
                ) : (
                    <Group>
                        <Button onClick={() => setFormVisible(true)}>{t('newSubscription')}</Button>
                    </Group>
                )}
            </Stack>

            {subscriptions.length ? (
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t('script')}</Table.Th>
                            <Table.Th>{t('event')}</Table.Th>
                            <Table.Th>{t('metaFilter')}</Table.Th>
                            <Table.Th/>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {subscriptions.map(subscription => (
                            <Table.Tr key={subscription.id}>
                                <Table.Td>
                                    <Anchor component={Link} to={editorUrl(subscription.scriptId)}>
                                        {subscription.scriptName}
                                    </Anchor>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <Text>{subscription.eventName}</Text>
                                        {registeredNames.has(subscription.eventName) ? null : (
                                            <Badge color="orange">{t('eventNotRegistered')}</Badge>
                                        )}
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        {parseMetaFilter(subscription.metaFilter).map(({key, value}, index) => (
                                            <Code key={index}>{key} = {value}</Code>
                                        ))}
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Button onClick={() => remove(subscription)}>{t('delete')}</Button>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            ) : (
                <Text>{t('emptySubscriptionList')}</Text>
            )}
        </>
    );
};

export default createModule(SubscriptionList);
