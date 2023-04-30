import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {Application} from "./components/Application";
import {AppContext, AppContextProvider} from "@thinking-home/ui";
import {ApiClient, MetaResponseDecoder, MessageHubConnection, toaster} from "./utils";
import {ToastContainer} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const init = async () => {
    const api = new ApiClient();

    const {
        pages,
        config: {lang, messageHub: messageHubConfig}
    } = await api.get(MetaResponseDecoder, {url: '/api/webui/meta'});

    const messageHub = new MessageHubConnection(messageHubConfig, ({topic, guid, timestamp, data}) => {
        console.log('topic:', topic);
        console.log('id:', guid);
        console.log('timestamp:', timestamp);
        console.log(data);
    });

    messageHub.start();

    const context: AppContext = {lang, api, toaster, messageHub};

    const app = (
        <React.StrictMode>
            <BrowserRouter>
                <AppContextProvider value={context}>
                    <Application pages={pages}/>
                    <ToastContainer theme='colored' hideProgressBar/>
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

// TODO: сделать клиентский логгер и прокидывать как зависимость, логировать в дебаге запросы и сообщения
// TODO: переделать подписку message hub на builder и описать в серверной документации
// TODO: написать клиентскую документацию про hub в зависимостях и про useMessageHandler
// TODO: написать клиентскую документацию про toaster
// TODO: написать клиентскую документацию отмену запросов и про деструктор приложения
// TODO: сделать серверные методы плагинов асинхронными 

init().then(destroy => {
    window.__DESTROY_TH_APP__ = destroy;
});
