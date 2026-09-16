import * as React from 'react';
import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Table, Text, Title} from '@mantine/core';
import {createModule, LogLevel, useAppContext, useKeyset, useLogger} from '@thinking-home/ui';

import {ChatListItem, getChatList} from './api';
import {keyset} from './lang';

// Отметка пустого значения: отличает незаполненное поле от пустой ячейки
const EMPTY_VALUE = '—';

const EmptyValue: FC = () => <Text c="dimmed">{EMPTY_VALUE}</Text>;

const ChatList: FC = () => {
    const {t} = useKeyset(keyset);
    const {api, toaster, lang} = useAppContext();
    const logger = useLogger();

    const [list, setList] = useState<ChatListItem[]>();

    // дата приходит без часового пояса, поэтому показывается как местное время.
    // у сервера без настройки culture язык приходит пустым — на пустой строке Intl падает,
    // поэтому в этом случае берется язык браузера
    const dateFormat = useMemo(
        () => new Intl.DateTimeFormat(lang || undefined, {dateStyle: 'medium', timeStyle: 'medium'}),
        [lang],
    );

    const fail = useCallback((message: string, signal?: AbortSignal) => (error: unknown) => {
        // отмена запроса при уходе со страницы — не ошибка
        if (signal?.aborted) return;

        logger.log(LogLevel.Error, error instanceof Error ? error.message : String(error));
        toaster.showError(message);
    }, [logger, toaster]);

    const load = useCallback((signal?: AbortSignal) => {
        getChatList(api, signal).then(setList, fail(t('errorLoad'), signal));
    }, [api, fail, t]);

    useEffect(() => {
        const controller = new AbortController();

        load(controller.signal);

        return () => controller.abort();
    }, [load]);

    if (!list) return null;

    return (
        <>
            <Title>{t('title')}</Title>

            {list.length ? (
                <Table my="md">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t('id')}</Table.Th>
                            <Table.Th>{t('login')}</Table.Th>
                            <Table.Th>{t('chatId')}</Table.Th>
                            <Table.Th>{t('firstName')}</Table.Th>
                            <Table.Th>{t('lastName')}</Table.Th>
                            <Table.Th>{t('date')}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {/* порядок строк — порядок ответа API (по убыванию даты), на клиенте он не меняется */}
                        {list.map(chat => (
                            <Table.Tr key={chat.id}>
                                <Table.Td>{chat.id}</Table.Td>
                                <Table.Td>{chat.login ?? <EmptyValue/>}</Table.Td>
                                <Table.Td>{chat.chatId}</Table.Td>
                                <Table.Td>{chat.firstName ?? <EmptyValue/>}</Table.Td>
                                <Table.Td>{chat.lastName ?? <EmptyValue/>}</Table.Td>
                                <Table.Td>{dateFormat.format(new Date(chat.date))}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            ) : (
                <Text c="dimmed" my="md">{t('emptyList')}</Text>
            )}
        </>
    );
};

export default createModule(ChatList);
