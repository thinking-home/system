import React, {useMemo} from "react";
import {FC} from "react";
import {Routes, Route} from "react-router";
import {Link, useLocation} from "react-router-dom";
import {ActionIcon, AppShell, Anchor, List, Stack, Text, Title, Tooltip, useComputedColorScheme, useMantineColorScheme} from "@mantine/core";
import {House, Moon, Sun} from "lucide-react";
import {LoggerProvider, useLogger} from "@thinking-home/ui";

import {PageDefinition, NS_FIELD} from "../utils";

import {ErrorScreen} from "./ErrorScreen";
import {Page} from "./Page";

// Навигация вертикальная и свернутая: на горизонтальных экранах высота дороже ширины,
// а иконки занимают меньше места, чем подписи. Фон темный в обеих цветовых схемах,
// поэтому цвета заданы явной палитрой, а не переменными схемы.
const NAVBAR_WIDTH = 56;
const NAVBAR_BACKGROUND = 'dark.8';
const NAVBAR_COLOR = 'gray.4';

export interface ApplicationProps {
    pages: Record<string, PageDefinition>;
}

const Home: React.FC = () => (
    <>
        <Title order={1}>Home</Title>
        <Text c="dimmed" my="sm">This is demo pages.</Text>
        <List>
            <List.Item>
                <Anchor component={Link} to="/scripts">Scripts</Anchor>
            </List.Item>
            <List.Item>
                <Anchor component={Link} to="/cron">Schedule</Anchor>
            </List.Item>
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

const ColorSchemeButton: FC = () => {
    const {setColorScheme} = useMantineColorScheme();
    const colorScheme = useComputedColorScheme('light');

    const next = colorScheme === 'dark' ? 'light' : 'dark';

    return (
        <Tooltip label={next === 'dark' ? 'Dark theme' : 'Light theme'} position="right">
            <ActionIcon
                variant="subtle"
                size="lg"
                color={NAVBAR_COLOR}
                onClick={() => setColorScheme(next)}
                aria-label="Toggle color scheme"
            >
                {colorScheme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
            </ActionIcon>
        </Tooltip>
    );
};

export const Application: FC<ApplicationProps> = ({pages}) => {
    return (
        <AppShell navbar={{width: NAVBAR_WIDTH, breakpoint: 0}} padding="md">
            <AppShell.Navbar bg={NAVBAR_BACKGROUND} p="xs">
                <Stack align="center" gap="xs" h="100%">
                    <Tooltip label="Home" position="right">
                        <ActionIcon
                            component={Link}
                            to="/"
                            variant="subtle"
                            size="lg"
                            color={NAVBAR_COLOR}
                            aria-label="Home"
                        >
                            <House size={20}/>
                        </ActionIcon>
                    </Tooltip>

                    {/* переключатель прижат к низу навигации */}
                    <Stack justify="flex-end" style={{flex: 1}}>
                        <ColorSchemeButton/>
                    </Stack>
                </Stack>
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
