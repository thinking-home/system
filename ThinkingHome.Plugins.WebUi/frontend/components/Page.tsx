import React from "react";
import {FC, useEffect, useState} from "react";
import {ErrorBoundary} from 'react-error-boundary'
import {UiModule} from '@thinking-home/ui';
import {ErrorScreen} from "./ErrorScreen";

interface PageProps {
    pathJs: string;
}

export const Page: FC<PageProps> = ({pathJs}) => {
    const [error, setError] = useState(false);
    const [content, setContent] = useState<UiModule>(undefined);

    useEffect(() => {
        import(/*webpackIgnore: true*/ pathJs).then(
            (m: { default: UiModule }) => {
                setContent(m.default)
            },
            () => {
                setError(true)
            },
        );
    }, [setContent]);

    if (error) {
        return <ErrorScreen message="Can't load module"/>;
    }

    if (!content) {
        return null;
    }

    const {Component} = content;

    return (
        <ErrorBoundary fallback={<ErrorScreen message='Undefined error'/>}>
            <Component/>
        </ErrorBoundary>
    );
};
