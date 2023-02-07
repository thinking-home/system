import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {Application} from "./components/Application";
import {AppContext, AppContextProvider} from "@thinking-home/ui";
import {ApiClient, MetaResponseDecoder, RadioConnection} from "./utils";

const init = async () => {
    const api = new ApiClient();

    const {pages, config: {lang, radio: radioConfig}} = await api.get(MetaResponseDecoder, {url: '/api/webui/meta'});

    const radio = new RadioConnection(radioConfig, ({topic, guid, timestamp, data}) => {
        console.log('topic:', topic);
        console.log('id:', guid);
        console.log('timestamp:', timestamp);
        console.log(data);
    });

    radio.start();

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
