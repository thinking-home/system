import {Decoder, draw} from "io-ts/Decoder";
import {isLeft} from "fp-ts/Either";
import * as d from "io-ts/Decoder";

export const parseData = function <T>(decoder: Decoder<unknown, T>, data: unknown): T {
    const parsed = decoder.decode(data);

    if (isLeft(parsed)) {
        throw new Error(draw(parsed.left));
    }

    return parsed.right;
}

export const MessageHubConfigDecoder = d.struct({
    route: d.string,
    clientMethod: d.string,
    serverMethod: d.string,
    reconnectionTimeout: d.number,
});

export type MessageHubConfig = d.TypeOf<typeof MessageHubConfigDecoder>;

export const PageDefinitionDecoder = d.struct({
    js: d.string,
    langId: d.string,
});

export type PageDefinition = d.TypeOf<typeof PageDefinitionDecoder>;

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

export const LangDataDecoder = d.record(d.string);

export const MessageHubMessageDecoder = d.struct({
    topic: d.string,
    data: UnknownDecoder,
    guid: d.string,
    timestamp: d.string,
});

export type MessageHubMessage = d.TypeOf<typeof MessageHubMessageDecoder>;
