import React, {useMemo} from "react";
import {FC} from "react";
import {Routes, Route} from "react-router";
import {Link, useLocation} from "react-router-dom";
import {cn} from '@bem-react/classname';
import {LoggerProvider, useLogger} from "@thinking-home/ui";

import {PageDefinition} from "../utils";
import {NS_FIELD} from "../utils/logger";

import {ErrorScreen} from "./ErrorScreen";
import {Page} from "./Page";

import './Application.css';

const cls = cn('Application');

export interface ApplicationProps {
    pages: Record<string, PageDefinition>;
}

const Home: React.FC = () => (
    <div>
        <h1>Home</h1>
        <p className="muted">
            This is demo pages.
        </p>
        <ul>
            <li>
                <Link to="/page1">Error handling example</Link>
            </li>
            <li>
                <Link to="/page2">Data loading example</Link>
            </li>
            <li>
                <Link to="/page3">Message hub and notifications example</Link>
            </li>
        </ul>
    </div>
);

export const Content: React.FC<{ pages: Record<string, PageDefinition> }> = ({pages}) => {
    const rootLogger = useLogger();
    const {pathname} = useLocation();
    const def = pages[pathname];

    const logger = useMemo(() => rootLogger.child({[NS_FIELD]: pathname}), [rootLogger, pathname]);
    
    if (def) {
        return (
            <LoggerProvider value={logger}>
                <Page key={pathname} pathJs={def.js}/>
            </LoggerProvider>
        );
    }

    return <ErrorScreen message='Page not found'/>;
}

export const Application: FC<ApplicationProps> = ({pages}) => {
    return (
        <div className={cls()}>
            <nav className="navbar navbar-expand-sm bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">My Home</Link>
                </div>
            </nav>
            <div className={cls('Content', ['container-fluid'])}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="*" element={<Content pages={pages}/>}/>
                </Routes>
            </div>
        </div>
    );
}
