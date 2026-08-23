import React, {useMemo} from "react";
import {FC} from "react";
import {Routes, Route} from "react-router";
import {Link, useLocation} from "react-router-dom";
import {AppShell, Anchor, List, Text, Title} from "@mantine/core";
import {LoggerProvider, useLogger} from "@thinking-home/ui";

import {PageDefinition, NS_FIELD} from "../utils";

import {ErrorScreen} from "./ErrorScreen";
import {Page} from "./Page";

// Навигация вертикальная: на горизонтальных экранах высота дороже ширины.
const NAVBAR_WIDTH = 220;

export interface ApplicationProps {
    pages: Record<string, PageDefinition>;
}

const Home: React.FC = () => (
    <>
        <Title order={1}>Home</Title>
        <Text c="dimmed" my="sm">This is demo pages.</Text>
        <List>
            <List.Item>
                <Anchor component={Link} to="/page1">Error handling example</Anchor>
            </List.Item>
            <List.Item>
                <Anchor component={Link} to="/page2">Data loading example</Anchor>
            </List.Item>
            <List.Item>
                <Anchor component={Link} to="/page3">Message hub and notifications example</Anchor>
            </List.Item>
        </List>
    </>
);

export const Content: React.FC<{ pages: Record<string, PageDefinition> }> = ({pages}) => {
    const rootLogger = useLogger();
    const {pathname} = useLocation();
    const def = pages[pathname];

    const logger = useMemo(() => rootLogger.child({[NS_FIELD]: pathname}), [rootLogger, pathname]);

    if (def) {
        return (
            <LoggerProvider value={logger}>
                <Page key={pathname} pathJs={def.js} langId={def.langId}/>
            </LoggerProvider>
        );
    }

    return <ErrorScreen message='Page not found'/>;
}

export const Application: FC<ApplicationProps> = ({pages}) => {
    return (
        <AppShell navbar={{width: NAVBAR_WIDTH, breakpoint: 0}} padding="md">
            <AppShell.Navbar p="md">
                <Anchor component={Link} to="/" fw={700} size="lg" underline="never">
                    My Home
                </Anchor>
            </AppShell.Navbar>
            <AppShell.Main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="*" element={<Content pages={pages}/>}/>
                </Routes>
            </AppShell.Main>
        </AppShell>
    );
}
