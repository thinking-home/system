import {Decoder, draw} from 'io-ts/Decoder';
import axios from 'axios';
import {isLeft} from 'fp-ts/lib/Either';
import * as d from 'io-ts/Decoder';
import {HubConnectionBuilder, IRetryPolicy, HubConnection} from '@microsoft/signalr';

import {ApiClient as BaseApiClient, QueryData, QueryParams} from "@thinking-home/ui";

const parseData = function <T>(decoder: Decoder<unknown, T>, data: unknown): T {
    const parsed = decoder.decode(data);

    if (isLeft(parsed)) {
        throw new Error(draw(parsed.left));
    }

    return parsed.right;
}

export class ApiClient implements BaseApiClient {
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
});

export type PageDefinition = d.TypeOf<typeof PageDefinitionDecoder>;

export const MessageHubConfigDecoder = d.struct({
    route: d.string,
    clientMethod: d.string,
    serverMethod: d.string,
    reconnectionTimeout: d.number,
});

export type MessageHubConfig = d.TypeOf<typeof MessageHubConfigDecoder>;

export const MetaResponseDecoder = d.struct({
    pages: d.record(PageDefinitionDecoder),
    config: d.struct({
        lang: d.string,
        messageHub: MessageHubConfigDecoder,
    }),
});

export const UnknownDecoder: d.Decoder<unknown, unknown> = d.fromGuard({
    is: (_: unknown): _ is unknown => true,
}, 'unknown value')

export const MessageHubMessageDecoder = d.struct({
    topic: d.string,
    data: UnknownDecoder,
    guid: d.string,
    timestamp: d.string,
});

export type MessageHubMessage = d.TypeOf<typeof MessageHubMessageDecoder>;

export class MessageHubConnection {
    private connection: HubConnection;

    constructor(private config: MessageHubConfig, callback: (msg: MessageHubMessage) => void) {
        const {route, reconnectionTimeout, clientMethod} = config;

        const retryPolicy: IRetryPolicy = {
            nextRetryDelayInMilliseconds: () => reconnectionTimeout,
        };

        this.connection = new HubConnectionBuilder()
            .withUrl(route)
            .withAutomaticReconnect(retryPolicy)
            .build();

        this.connection.on(clientMethod, (msg: unknown) => {
            const parsedMsg = parseData(MessageHubMessageDecoder, msg);
            callback(parsedMsg);
        });
    }

    start = (): Promise<void> => this.connection.start();
    send = (channel: string, data: unknown) => this.connection.invoke(this.config.serverMethod, data);
}
