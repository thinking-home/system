import {Decoder, draw} from 'io-ts/Decoder';
import axios from 'axios';
import {isLeft} from 'fp-ts/lib/Either';
import * as d from 'io-ts/Decoder';

import {ApiClient, QueryData, QueryParams} from "@thinking-home/ui";

export class XClient implements ApiClient {
    client = axios.create();

    async get<T>(decoder: Decoder<unknown, T>, query: { url: string; params?: QueryParams }): Promise<T> {
        const {url, params} = query;
        const response = await this.client.get(url, {params});
        const parsed = decoder.decode(response.data);

        if (isLeft(parsed)) {
            throw new Error(draw(parsed.left));
        }

        return parsed.right;
    }

    async post<T>(decoder: Decoder<unknown, T>, query: { url: string; params?: QueryParams; data: QueryData }): Promise<T> {
        const {url, params, data} = query;
        const response = await this.client.post(url, data, {params});
        const parsed = decoder.decode(response.data);

        if (isLeft(parsed)) {
            throw new Error(draw(parsed.left));
        }

        return parsed.right;
    }
}

export const PageDefinitionDecoder = d.struct({
    js: d.string,
    css: d.string,
});

export type PageDefinition = d.TypeOf<typeof PageDefinitionDecoder>;

export const MetaResponseDecoder = d.struct({
    pages: d.record(PageDefinitionDecoder),
    config: d.struct({
        lang: d.string,
    }),
});
