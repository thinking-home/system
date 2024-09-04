import React from "react";
import {FC, useEffect, useState} from "react";
import {ErrorBoundary} from 'react-error-boundary'
import {UiModule, useAppContext, I18nProvider} from '@thinking-home/ui';
import {Context as I18nContext} from '@thinking-home/i18n';

import {LangDataDecoder} from "../utils";

import {ErrorScreen} from "./ErrorScreen";

interface PageProps {
    pathJs: string;
    langId: string;
}

export const Page: FC<PageProps> = ({pathJs, langId}) => {
    const {api, lang} = useAppContext();
    const [error, setError] = useState(false);
    const [content, setContent] = useState<UiModule>(undefined);
    const [i18nContext, setI18nContext] = useState<I18nContext | undefined>(undefined);

    useEffect(() => {
        Promise.all([
            import(/*webpackIgnore: true*/ pathJs),
            api.get(LangDataDecoder, {url: '/api/webui/lang', params: {id: langId}})
        ]).then(
            ([m, messages]: [{ default: UiModule }, Record<string, string>]) => {
                setContent(m.default);
                setI18nContext(new I18nContext({
                    locale: lang,
                    messages
                }));
            },
            () => {
                setError(true)
            },
        );
    }, [setContent, setError, lang, api, pathJs, langId]);

    if (error) {
        return <ErrorScreen message="Can't load module"/>;
    }

    if (!content) {
        return null;
    }

    const {Component} = content;

    return (
        <ErrorBoundary fallback={<ErrorScreen message='Undefined error'/>}>
            <I18nProvider value={i18nContext}>
                <Component/>
            </I18nProvider>
        </ErrorBoundary>
    );
};
