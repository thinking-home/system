import {MessageHub, ReceivedMessage} from "@thinking-home/ui";
import {HubConnection, HubConnectionBuilder, IRetryPolicy} from "@microsoft/signalr";
import {Decoder} from "io-ts/Decoder";
import {MessageHubConfig, MessageHubMessage, MessageHubMessageDecoder, parseData} from "./types";

export class MessageHubConnection implements MessageHub {
    private connection: HubConnection;

    constructor(private config: MessageHubConfig, callback?: (msg: MessageHubMessage) => void) {
        const {route, reconnectionTimeout, clientMethod} = config;

        const retryPolicy: IRetryPolicy = {
            nextRetryDelayInMilliseconds: () => reconnectionTimeout,
        };

        this.connection = new HubConnectionBuilder()
            .withUrl(route)
            .withAutomaticReconnect(retryPolicy)
            .build();

        this.connection.on(clientMethod, (msg: unknown) => {
            try {
                const parsedMsg = parseData(MessageHubMessageDecoder, msg);
                callback?.(parsedMsg);
            } catch (err: unknown) {
                console.error(err);
            }
        });
    }

    start = (): Promise<void> => this.connection.start();

    dispose = (): Promise<void> => this.connection.stop();

    send = (topic: string, data: unknown) => this.connection.invoke(this.config.serverMethod, topic, data);

    subscribe<T>(
        topic: string,
        decoder: Decoder<unknown, T>,
        callback: (msg: ReceivedMessage<T>) => void,
    ): () => void {
        const {clientMethod} = this.config;

        const handler = (msg: unknown) => {
            try {
                const {topic, guid, timestamp, data} = parseData(MessageHubMessageDecoder, msg);
                const parsedData = parseData(decoder, data);

                try {
                    callback({topic, guid, timestamp, data: parsedData});
                } catch (err) {
                    console.error(err);
                }
            } catch (err: unknown) {
                console.error(err);
            }
        };

        this.connection.on(clientMethod, handler);

        return () => {
            this.connection.off(clientMethod, handler);
        };
    }
}

