import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {AppContext, AppContextProvider, LoggerProvider, LogLevel} from "@thinking-home/ui";
import {MantineProvider} from "@mantine/core";
import {ToastContainer} from 'react-toastify';

import {Application} from "./components/Application";
import {
    ApiClient,
    AppLogger,
    ConsoleLogDestination,
    MessageHubConnection,
    MetaResponseSchema,
    Theme,
    toaster,
    NS_FIELD,
} from "./utils";

import 'react-toastify/dist/ReactToastify.css';

// Схему задаёт настройка плагина на сервере, переключателя в интерфейсе нет.
// Оформление внутри схемы — дело клиента: здесь появятся палитры и акцентные
// цвета, когда тем станет больше.
const getThemeProps = (theme: Theme) => {
    switch (theme) {
        case 'dark':
            return {forceColorScheme: 'dark'} as const;
        case 'light':
            return {forceColorScheme: 'light'} as const;
    }
};

const init = async () => {
    const api = new ApiClient();

    const {
        pages,
        config: {lang, theme, messageHub: messageHubConfig}
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
            <MantineProvider {...getThemeProps(theme)}>
                <BrowserRouter>
                    <AppContextProvider value={context}>
                        <LoggerProvider value={logger}>
                            <Application pages={pages}/>
                            <ToastContainer theme='colored' hideProgressBar/>
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
