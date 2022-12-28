import {Decoder, draw} from 'io-ts/Decoder';
import axios from 'axios';
import {isLeft} from 'fp-ts/lib/Either';
import * as d from 'io-ts/Decoder';

import {ApiClient, QueryData, QueryParams} from "@thinking-home/ui";

const parseData = function<T>(decoder: Decoder<unknown, T>, data: unknown): T {
    const parsed = decoder.decode(data);

    if (isLeft(parsed)) {
        throw new Error(draw(parsed.left));
    }

    return parsed.right;
}

export class XClient implements ApiClient {
    client = axios.create();

    async get<T>(decoder: Decoder<unknown, T>, query: { url: string; params?: QueryParams }): Promise<T> {
        const {url, params} = query;
        const response = await this.client.get(url, {params});
        
        return parseData(decoder, response.data);
    }

    async post<T>(decoder: Decoder<unknown, T>, query: { url: string; params?: QueryParams; data: QueryData }): Promise<T> {
        const {url, params, data} = query;
        const response = await this.client.post(url, data, {params});

        return parseData(decoder, response.data);
    }
}

export const PageDefinitionDecoder = d.struct({
    js: d.string,
    css: d.nullable(d.string),
});

export type PageDefinition = d.TypeOf<typeof PageDefinitionDecoder>;

export const MetaResponseDecoder = d.struct({
    pages: d.record(PageDefinitionDecoder),
    config: d.struct({
        lang: d.string,
    }),
});
