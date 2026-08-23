import * as React from 'react';
import {FC, useCallback, useEffect, useState} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Anchor, Button, Code, Group, Input, Stack, Text, TextInput, Title} from '@mantine/core';
import {createModule, LogLevel, useAppContext, useKeyset, useLogger} from '@thinking-home/ui';

import {getScript, runScript, saveScript} from './api';
import {CodeEditor} from './CodeEditor';
import {keyset} from './lang';

const LIST_URL = '/scripts';
const editorUrl = (id: string) => `/scripts/edit?id=${id}`;

// Браузер отправляет текст формы с переводами строк CRLF, и сохраненный сценарий
// приезжает с ними обратно. Приводим текст к тому виду, в котором он живет в
// редакторе, иначе загруженный сценарий сразу считался бы измененным.
const normalize = (text: string) => text.replace(/\r\n/g, '\n');

const ScriptEditor: FC = () => {
    const {t} = useKeyset(keyset);
    const {api, toaster} = useAppContext();
    const logger = useLogger();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const id = searchParams.get('id') ?? undefined;

    const [scriptId, setScriptId] = useState(id);
    const [name, setName] = useState('');
    const [body, setBody] = useState('');

    // последнее сохраненное состояние: по нему видно, есть ли несохраненные правки
    const [saved, setSaved] = useState({name: '', body: ''});

    const [result, setResult] = useState<string>();

    const fail = useCallback((message: string, signal?: AbortSignal) => (error: unknown) => {
        // отмена запроса при уходе со страницы — не ошибка
        if (signal?.aborted) return;

        logger.log(LogLevel.Error, error instanceof Error ? error.message : String(error));
        toaster.showError(message);
    }, [logger, toaster]);

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();
        const {signal} = controller;

        getScript(api, id, signal).then(script => {
            const text = normalize(script.body);

            setScriptId(script.id);
            setName(script.name);
            setBody(text);
            setSaved({name: script.name, body: text});
        }, fail(t('errorLoad'), signal));

        return () => controller.abort();
    }, [api, id, fail, t]);

    const save = useCallback(() => {
        if (!name.trim()) {
            toaster.showError(t('nameRequired'));
            return;
        }

        saveScript(api, {id: scriptId, name, body}).then(
            ({scriptId: savedId}) => {
                setScriptId(savedId);
                setSaved({name, body});
                toaster.showSuccess(t('saved'));

                // у нового сценария появился id: без него перезагрузка страницы
                // открыла бы пустой редактор
                if (!scriptId) navigate(editorUrl(savedId), {replace: true});
            },
            fail(t('errorSave')),
        );
    }, [api, scriptId, name, body, toaster, t, navigate, fail]);

    const run = useCallback(() => {
        if (!scriptId) return;

        runScript(api, scriptId).then(
            value => setResult(JSON.stringify(value ?? null, null, 4)),
            fail(t('errorRun')),
        );
    }, [api, scriptId, t, fail]);

    // сервер выполняет сохраненный сценарий, поэтому запускать имеет смысл
    // только то, что уже сохранено
    const canRun = Boolean(scriptId) && name === saved.name && body === saved.body;

    return (
        <Stack>
            <Title>{saved.name || t('newScript')}</Title>

            <Anchor component={Link} to={LIST_URL}>{t('backToList')}</Anchor>

            <TextInput
                label={t('name')}
                value={name}
                onChange={event => setName(event.currentTarget.value)}
            />

            <Input.Wrapper label={t('code')}>
                <CodeEditor value={body} onChange={setBody}/>
            </Input.Wrapper>

            <Group>
                <Button onClick={save}>{t('save')}</Button>
                <Button onClick={run} disabled={!canRun}>{t('run')}</Button>
                {canRun ? null : <Text>{t('runHint')}</Text>}
            </Group>

            {result === undefined ? null : (
                <div>
                    <Text>{t('result')}</Text>
                    <Code block>{result}</Code>
                </div>
            )}
        </Stack>
    );
};

export default createModule(ScriptEditor);
