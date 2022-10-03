import React from "react";
import {FC, useEffect, useState} from "react";
import {ErrorBoundary} from 'react-error-boundary'
import { UiModule } from '@thinking-home/ui';

interface PageProps {
    path: string;
}

export const Page: FC<PageProps> = ({path}) => {
    const [error, setError] = useState(false);
    const [content, setContent] = useState<UiModule>(undefined);

    useEffect(() => {
        import(/*webpackIgnore: true*/ path).then(
            (m: { default: UiModule }) => { setContent(m.default) },
            () => { setError(true) },
        );
    }, [setContent]);
    
    if (error) {
        return <>504</>;
    }

    if (!content) {
        return null;
    }
    
    const { Component } = content;

    return (
        <ErrorBoundary fallback={<>500</>}>
            <Component/>
        </ErrorBoundary>
    );
};
