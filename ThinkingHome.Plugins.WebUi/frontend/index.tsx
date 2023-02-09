import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {Application} from "./components/Application";
import {AppContext, AppContextProvider} from "@thinking-home/ui";
import {ApiClient, MetaResponseDecoder, MessageHubConnection} from "./utils";

const init = async () => {
    const api = new ApiClient();

    const {pages, config: {lang, messageHub: messageHubConfig }} = await api.get(MetaResponseDecoder, {url: '/api/webui/meta'});

    const messageHub = new MessageHubConnection(messageHubConfig, ({topic, guid, timestamp, data}) => {
        console.log('topic:', topic);
        console.log('id:', guid);
        console.log('timestamp:', timestamp);
        console.log(data);
    });

    messageHub.start();

    const context: AppContext = {lang, api};

    const app = (
        <React.StrictMode>
            <BrowserRouter>
                <AppContextProvider value={context}>
                    <Application pages={pages}/>
                </AppContextProvider>
            </BrowserRouter>
        </React.StrictMode>
    );

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(app);
};

init();
