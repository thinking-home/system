import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {Application} from "./components/Application";
import {AppContext, AppContextProvider} from "@thinking-home/ui";
import {ApiClient, MetaResponseDecoder} from "./utils";

const init = async () => {
    const api = new ApiClient();
    
    const { pages, config: { lang } } = await api.get(MetaResponseDecoder, { url: '/api/webui/meta' });

    const context: AppContext = { lang, api };

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
