import * as React from 'react';
import {FC, useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Anchor, Button, Group, Table, Text, Title} from '@mantine/core';
import {createModule, LogLevel, useAppContext, useKeyset, useLogger} from '@thinking-home/ui';

import {deleteScript, getScriptList, ScriptListItem} from './api';
import {keyset} from './lang';

const ScriptList: FC = () => {
    const {t} = useKeyset(keyset);
    const {api, toaster} = useAppContext();
    const logger = useLogger();

    const [list, setList] = useState<ScriptListItem[]>();
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

    const fail = useCallback((message: string, signal?: AbortSignal) => (error: unknown) => {
        // отмена запроса при уходе со страницы — не ошибка
        if (signal?.aborted) return;

        logger.log(LogLevel.Error, error instanceof Error ? error.message : String(error));
        toaster.showError(message);
    }, [logger, toaster]);

    const load = useCallback((signal?: AbortSignal) => {
        setStatus('loading');
        getScriptList(api, signal).then(
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

    const remove = useCallback((script: ScriptListItem) => {
        if (!confirm(t('deleteConfirm', {name: script.name}))) return;

        deleteScript(api, script.id).then(
            () => {
                toaster.showSuccess(t('deleted'));
                load();
            },
            fail(t('errorDelete')),
        );
    }, [api, t, toaster, load, fail]);

    return (
        <>
            <Title>{t('title')}</Title>

            <Group my="md">
                <Button component={Link} to="/scripts/edit">{t('newScript')}</Button>
                <Button component={Link} to="/scripts/subscriptions" variant="default">{t('subscriptions')}</Button>
            </Group>

            {status === 'loading' ? null : status === 'error' ? (
                <Text c="dimmed" ta="center" my="xl">{t('errorLoad')}</Text>
            ) : list?.length ? (
                <Table>
                    <Table.Tbody>
                        {list.map(script => (
                            <Table.Tr key={script.id}>
                                <Table.Td>
                                    <Anchor component={Link} to={`/scripts/edit?id=${script.id}`}>
                                        {script.name}
                                    </Anchor>
                                </Table.Td>
                                <Table.Td>
                                    <Button onClick={() => remove(script)}>{t('delete')}</Button>
                                </Table.Td>
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

export default createModule(ScriptList);
