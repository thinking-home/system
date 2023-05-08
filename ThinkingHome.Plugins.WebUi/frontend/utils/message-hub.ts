import {Logger, LogLevel, MessageHub, ReceivedMessage} from "@thinking-home/ui";
import {
    HubConnection,
    HubConnectionBuilder,
    ILogger,
    IRetryPolicy,
    LogLevel as SignalrLogLevel
} from "@microsoft/signalr";
import {Decoder} from "io-ts/Decoder";
import {MessageHubConfig, MessageHubMessage, MessageHubMessageDecoder, parseData} from "./types";

const LogLevelMap: Record<SignalrLogLevel, LogLevel> = {
    [SignalrLogLevel.None]: LogLevel.Trace,
    [SignalrLogLevel.Trace]: LogLevel.Trace,
    [SignalrLogLevel.Debug]: LogLevel.Debug,
    [SignalrLogLevel.Information]: LogLevel.Information,
    [SignalrLogLevel.Warning]: LogLevel.Warning,
    [SignalrLogLevel.Error]: LogLevel.Error,
    [SignalrLogLevel.Critical]: LogLevel.Fatal,
};

export class MessageHubConnection implements MessageHub {
    private connection: HubConnection;

    constructor(
        private config: MessageHubConfig,
        private logger: Logger,
        callback?: (msg: MessageHubMessage) => void,
    ) {
        const {route, reconnectionTimeout, clientMethod} = config;
        const log: ILogger['log'] = (level, message) => logger.log(LogLevelMap[level], message);

        const retryPolicy: IRetryPolicy = {
            nextRetryDelayInMilliseconds: () => reconnectionTimeout,
        };

        this.connection = new HubConnectionBuilder()
            .configureLogging({log})
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

