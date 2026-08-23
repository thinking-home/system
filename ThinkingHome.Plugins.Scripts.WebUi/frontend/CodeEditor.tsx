import * as React from 'react';
import {FC, useEffect, useRef} from 'react';
import {Box, useComputedColorScheme} from '@mantine/core';
import {Compartment} from '@codemirror/state';
import {EditorView} from '@codemirror/view';
import {basicSetup} from 'codemirror';
import {javascript} from '@codemirror/lang-javascript';
import {oneDark} from '@codemirror/theme-one-dark';

import './fonts.css';

const EDITOR_THEME = EditorView.theme({
    '&': {height: '60vh'},
    '.cm-scroller': {fontFamily: "'JetBrains Mono', monospace"},
});

export interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export const CodeEditor: FC<CodeEditorProps> = ({value, onChange}) => {
    const container = useRef<HTMLDivElement>(null);
    const view = useRef<EditorView>(null);
    const theme = useRef(new Compartment());

    // Редактор создается один раз, поэтому обработчик он берет из ссылки:
    // иначе при каждой правке пришлось бы пересоздавать его вместе с содержимым.
    const latest = useRef(onChange);
    latest.current = onChange;

    const colorScheme = useComputedColorScheme('light');

    useEffect(() => {
        const editor = new EditorView({
            parent: container.current ?? undefined,
            doc: value,
            extensions: [
                basicSetup,
                javascript(),
                EDITOR_THEME,
                theme.current.of([]),
                EditorView.updateListener.of(update => {
                    if (update.docChanged) {
                        latest.current(update.state.doc.toString());
                    }
                }),
            ],
        });

        view.current = editor;

        return () => editor.destroy();
    }, []);

    useEffect(() => {
        view.current?.dispatch({
            effects: theme.current.reconfigure(colorScheme === 'dark' ? oneDark : []),
        });
    }, [colorScheme]);

    useEffect(() => {
        const editor = view.current;

        // текст пришел извне (например, загрузился сценарий): заменяем содержимое,
        // но только если оно действительно отличается — иначе собьется курсор
        if (editor && value !== editor.state.doc.toString()) {
            editor.dispatch({
                changes: {from: 0, to: editor.state.doc.length, insert: value},
            });
        }
    }, [value]);

    return (
        <Box
            ref={container}
            style={{
                border: '1px solid var(--mantine-color-default-border)',
                borderRadius: 'var(--mantine-radius-sm)',
                overflow: 'hidden',
            }}
        />
    );
};
