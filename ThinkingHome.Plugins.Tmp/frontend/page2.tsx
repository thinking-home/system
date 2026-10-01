import * as React from 'react';
import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Button, Text} from '@mantine/core';
import {createModule, LogLevel, useAppContext, useKeyset, useLogger} from '@thinking-home/ui';
import * as v from 'valibot';

import {keyset} from './lang';

const url = '/api/tmp/pigs';
const tmpPigSchema = v.object({
    id: v.string(),
    name: v.string(),
    size: v.number(),
});

type Pig = v.InferOutput<typeof tmpPigSchema>;

const tmpResponseSchema = v.array(tmpPigSchema);

const TmpSection: FC = () => {
    const [list, setList] = useState<Pig[]>([]);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'cancelled'>('loading');
    const {api} = useAppContext();
    const {t} = useKeyset(keyset);
    const controller = useMemo(() => new AbortController(), []);
    const logger = useLogger();

    useEffect(() => {
        api.get(tmpResponseSchema, {url, signal: controller.signal})
            .then(
                list => {
                    setList(list);
                    setStatus('ready');
                },
                error => {
                    if (controller.signal.aborted) return;

                    logger.log(LogLevel.Error, error instanceof Error ? error.message : 'error');
                    setStatus('error');
                },
            );

        return () => controller.abort();
    }, [controller, logger]);

    const cancel = useCallback(() => {
        controller.abort();
        setStatus('cancelled');
    }, [controller]);

    const content = status === 'loading' ? <div>LOADING...</div> : status === 'error' ? (
        <Text c="dimmed" ta="center" my="xl">{t('errorLoad')}</Text>
    ) : status === 'cancelled' ? (
        <Text c="dimmed" ta="center" my="xl">{t('loadCancelled')}</Text>
    ) : list.length ? (
        <ul>
            {list.map(pig => <li key={pig.id}>{pig.name} ({pig.size})</li>)}
        </ul>
    ) : <Text c="dimmed" ta="center" my="xl">{t('emptyList')}</Text>;

    const cancelButton = status === 'loading' ? (
        <p>
            <Button variant="default" onClick={cancel}>Cancel request</Button>
        </p>
    ) : null;

    return (
        <div>
            <p>This is the <strong>Test page 2</strong> (from <code>Tmp plugin</code>)</p>
            {cancelButton}
            {content}
        </div>
    );
};

export default createModule(TmpSection);
