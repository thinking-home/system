import React from "react";
import {FC, useEffect, useState} from "react";
import { UiModule } from '@thinking-home/ui';

interface PageProps {
    path: string;
}

export const Page: FC<PageProps> = ({path}) => {
    const [content, setContent] = useState<UiModule>(undefined);

    useEffect(() => {
        import(/*webpackIgnore: true*/ path).then((m: { default: UiModule }) => {
            setContent(m.default);
        });
    }, [setContent]);

    if (!content) {
        return <>LOADING</>;
    }
    
    const { Component } = content;

    return <Component/>;
};
