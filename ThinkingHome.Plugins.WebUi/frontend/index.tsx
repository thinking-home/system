import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {AppContext, AppContextProvider, LoggerProvider, LogLevel} from "@thinking-home/ui";
import {ToastContainer} from 'react-toastify';

import {Application} from "./components/Application";
import {
    ApiClient,
    AppLogger,
    ConsoleLogDestination,
    MessageHubConnection,
    MetaResponseDecoder,
    toaster,
    NS_FIELD,
} from "./utils";

import 'react-toastify/dist/ReactToastify.css';

const init = async () => {
    const api = new ApiClient();

    const {
        pages,
        config: {lang, messageHub: messageHubConfig}
    } = await api.get(MetaResponseDecoder, {url: '/api/webui/meta'});

    // logger
    const writerConsole = new ConsoleLogDestination(LogLevel.Information);
    const logger = new AppLogger([writerConsole], {[NS_FIELD]: 'application'}, Date.now);

    // messages
    const messageHub = new MessageHubConnection(messageHubConfig, logger);
    messageHub.start();

    const context: AppContext = {lang, api, toaster, messageHub};

    const app = (
        <React.StrictMode>
            <BrowserRouter>
                <AppContextProvider value={context}>
                    <LoggerProvider value={logger}>
                        <Application pages={pages}/>
                        <ToastContainer theme='colored' hideProgressBar/>
                    </LoggerProvider>
                </AppContextProvider>
            </BrowserRouter>
        </React.StrictMode>
    );

    const root = ReactDOM.createRoot(document.getElementById("root"));
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
    }
}

init().then(destroy => {
    window.__DESTROY_TH_APP__ = destroy;
});
