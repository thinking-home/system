import * as React from 'react';
import {FC, useCallback, useEffect, useState} from 'react';
import {Table, Text, Title} from '@mantine/core';
import {createModule, LogLevel, useAppContext, useKeyset, useLogger} from '@thinking-home/ui';

import {ChatListItem, getChatList} from './api';
import {keyset} from './lang';

const ChatList: FC = () => {
    const {t} = useKeyset(keyset);
    const {api, toaster} = useAppContext();
    const logger = useLogger();

    const [list, setList] = useState<ChatListItem[]>();

    const fail = useCallback((message: string, signal?: AbortSignal) => (error: unknown) => {
        // отмена запроса при уходе со страницы — не ошибка
        if (signal?.aborted) return;

        logger.log(LogLevel.Error, error instanceof Error ? error.message : String(error));
        toaster.showError(message);
    }, [logger, toaster]);

    useEffect(() => {
        const controller = new AbortController();

        getChatList(api, controller.signal).then(setList, fail(t('errorLoad'), controller.signal));

        return () => controller.abort();
    }, [api, fail, t]);

    if (!list) return null;

    return (
        <>
            <Title>{t('title')}</Title>

            {list.length ? (
                <Table mt="md">
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
                        {list.map(chat => (
                            <Table.Tr key={chat.id}>
                                <Table.Td>{chat.id}</Table.Td>
                                <Table.Td>{chat.login ?? ''}</Table.Td>
                                <Table.Td>{chat.chatId}</Table.Td>
                                <Table.Td>{chat.firstName ?? ''}</Table.Td>
                                <Table.Td>{chat.lastName ?? ''}</Table.Td>
                                <Table.Td>{chat.date}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            ) : (
                <Text mt="md">{t('emptyList')}</Text>
            )}
        </>
    );
};

export default createModule(ChatList);
