import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {Application} from "./components/Application";

import {Decoder, draw} from 'io-ts/Decoder';
import axios from 'axios';
import {AppContextProvider, ApiClient, QueryParams, QueryData, AppContext} from '@thinking-home/ui';
import {isLeft} from 'fp-ts/lib/Either';

class XClient implements ApiClient {
    client = axios.create();

    async get<T>(decoder: Decoder<unknown, T>, query: { url: string; params?: QueryParams }): Promise<T> {
        const {url, params} = query;
        const obj = await this.client.get(url, {params});
        const parsed = decoder.decode(obj);

        if (isLeft(parsed)) {
            throw new Error(draw(parsed.left));
        }

        return parsed.right;
    }

    async post<T>(decoder: Decoder<unknown, T>, query: { url: string; params?: QueryParams; data: QueryData }): Promise<T> {
        const {url, params, data} = query;
        const obj = await this.client.post(url, data, {params});
        const parsed = decoder.decode(obj);

        if (isLeft(parsed)) {
            throw new Error(draw(parsed.left));
        }

        return parsed.right;
    }
}

const context: AppContext = {
    lang: 'ru',
    api: new XClient(),
}

const app = (
    <React.StrictMode>
        <BrowserRouter>
            <AppContextProvider value={context}>
                <Application/>
            </AppContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(app);
