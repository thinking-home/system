import React from "react";
import {ComponentType, FC, useEffect, useState} from "react";

export const Page: FC<{ path: string }> = ({path}) => {
    const [Content, setContent] = useState<ComponentType>(undefined);

    useEffect(() => {
        import(/*webpackIgnore: true*/ path).then((m: { default: ComponentType }) => {
            setContent(m.default);
        });
    }, [setContent]);

    if (!Content) {
        return <>LOADING</>;
    }

    return <Content/>;
};
