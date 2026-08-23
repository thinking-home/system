import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {AppContext, AppContextProvider, LoggerProvider, LogLevel} from "@thinking-home/ui";
import {MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";

import {Application} from "./components/Application";
import {
    ApiClient,
    AppLogger,
    ConsoleLogDestination,
    MessageHubConnection,
    MetaResponseSchema,
    toaster,
    NS_FIELD,
} from "./utils";

import '@mantine/notifications/styles.css';

const init = async () => {
    const api = new ApiClient();

    const {
        pages,
        config: {lang, messageHub: messageHubConfig}
    } = await api.get(MetaResponseSchema, {url: '/api/webui/meta'});

    // logger
    const writerConsole = new ConsoleLogDestination(LogLevel.Information);
    const logger = new AppLogger([writerConsole], {[NS_FIELD]: 'application'}, Date.now);

    // messages
    const messageHub = new MessageHubConnection(messageHubConfig, logger);
    messageHub.start();

    const context: AppContext = {lang, api, toaster, messageHub};

    const app = (
        <React.StrictMode>
            {/* тему выбирает пользователь, кит сам хранит выбор в localStorage */}
            <MantineProvider defaultColorScheme="light">
                <BrowserRouter>
                    <AppContextProvider value={context}>
                        <LoggerProvider value={logger}>
                            <Notifications/>
                            <Application pages={pages}/>
                        </LoggerProvider>
                    </AppContextProvider>
                </BrowserRouter>
            </MantineProvider>
        </React.StrictMode>
    );

    const root = ReactDOM.createRoot(document.getElementById("root")!);
    root.render(app);

    return async () => {
        root.unmount();
        api.abortController.abort();
        await messageHub.dispose();
    };
};

declare global {
    interface Window {
        __DESTROY_TH_APP__?: () => Promise<void>;
        __RELOAD_TH_APP__?: () => Promise<void>;
    }
}

window.__RELOAD_TH_APP__ = async () => {
    await window.__DESTROY_TH_APP__?.();
    window.__DESTROY_TH_APP__ = await init();
}

window.__RELOAD_TH_APP__();
