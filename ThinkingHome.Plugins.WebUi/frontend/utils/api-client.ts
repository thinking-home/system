import {ApiClient as BaseApiClient, QueryData, QueryParams} from "@thinking-home/ui";
import axios from "axios";
import {Decoder} from "io-ts/Decoder";
import {parseData} from "./types";

export class ApiClient implements BaseApiClient {
    private client = axios.create();

    public abortController = new AbortController();

    private combineAbortSignals(signal?: AbortSignal) {
        if (!signal) {
            return {
                signal: this.abortController.signal,
            };
        }

        const controller = new AbortController();
        const options = {signal: controller.signal};

        const attach = (s: AbortSignal) => {
            if (s.aborted) {
                controller.abort(s.reason);
            }

            const listener = () => controller.abort(s.reason);
            s.addEventListener('abort', listener, options);

            return () => s.removeEventListener('abort', listener);
        };

        const unsubscribe1 = attach(this.abortController.signal);
        const unsubscribe2 = attach(signal);

        return {
            signal: controller.signal,
            unsubscribe: () => {
                unsubscribe1();
                unsubscribe2();
            }
        }
    }

    public async get<T>(decoder: Decoder<unknown, T>, query: {
        url: string;
        params?: QueryParams,
        signal?: AbortSignal,
    }): Promise<T> {
        const {url, params} = query;
        const {signal, unsubscribe} = this.combineAbortSignals(query.signal);

        try {
            const response = await this.client.get(url, {params, signal});
            return parseData(decoder, response.data);
        } finally {
            unsubscribe?.();
        }
    }

    public async post<T>(decoder: Decoder<unknown, T>, query: {
        url: string;
        params?: QueryParams;
        data: QueryData,
        signal?: AbortSignal
    }): Promise<T> {
        const {url, params, data} = query;
        const {signal, unsubscribe} = this.combineAbortSignals(query.signal);

        try {
            const response = await this.client.post(url, data, {params, signal});
            return parseData(decoder, response.data);
        } finally {
            unsubscribe?.();
        }
    }
}
