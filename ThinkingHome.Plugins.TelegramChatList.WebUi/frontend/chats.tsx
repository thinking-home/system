import * as React from 'react';
import {FC, useCallback, useEffect, useState} from 'react';
import {Table, Text, Title} from '@mantine/core';
import {createModule, LogLevel, useAppContext, useKeyset, useLogger} from '@thinking-home/ui';

import {ChatListItem, getChatList} from './api';
import {keyset} from './lang';

const TelegramChatList: FC = () => {
    const {t} = useKeyset(keyset);
    const {api, toaster} = useAppContext();
    const logger = useLogger();

    const [list, setList] = useState<ChatListItem[]>();
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

    const fail = useCallback((message: string, signal?: AbortSignal) => (error: unknown) => {
        // отмена запроса при уходе со страницы — не ошибка
        if (signal?.aborted) return;

        logger.log(LogLevel.Error, error instanceof Error ? error.message : String(error));
        toaster.showError(message);
    }, [logger, toaster]);

    const load = useCallback((signal?: AbortSignal) => {
        setStatus('loading');
        getChatList(api, signal).then(
            list => {
                setList(list);
                setStatus('ready');
            },
            error => {
                if (signal?.aborted) return;

                setStatus('error');
                fail(t('errorLoad'), signal)(error);
            },
        );
    }, [api, fail, t]);

    useEffect(() => {
        const controller = new AbortController();

        load(controller.signal);

        return () => controller.abort();
    }, [load]);

    return (
        <>
            <Title>{t('title')}</Title>

            {status === 'loading' ? null : status === 'error' ? (
                <Text c="dimmed" ta="center" my="xl">{t('errorLoad')}</Text>
            ) : list?.length ? (
                <Table mt="md">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>{t('chatId')}</Table.Th>
                            <Table.Th>{t('login')}</Table.Th>
                            <Table.Th>{t('firstName')}</Table.Th>
                            <Table.Th>{t('lastName')}</Table.Th>
                            <Table.Th>{t('date')}</Table.Th>
                            <Table.Th>{t('id')}</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {list.map(chat => (
                            <Table.Tr key={chat.id}>
                                <Table.Td>{chat.chatId}</Table.Td>
                                <Table.Td>{chat.login ?? '—'}</Table.Td>
                                <Table.Td>{chat.firstName ?? '—'}</Table.Td>
                                <Table.Td>{chat.lastName ?? '—'}</Table.Td>
                                <Table.Td>{new Date(chat.date).toLocaleString()}</Table.Td>
                                <Table.Td>{chat.id}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            ) : (
                <Text c="dimmed" ta="center" my="xl">{t('emptyList')}</Text>
            )}
        </>
    );
};

export default createModule(TelegramChatList);
