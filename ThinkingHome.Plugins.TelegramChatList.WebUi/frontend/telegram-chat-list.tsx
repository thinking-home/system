import * as React from 'react';
import {FC} from 'react';
import * as d from 'io-ts/Decoder';
import {createModule, useAppContext} from '@thinking-home/ui';

const myResponseDecoder = d.struct({
    id: d.string,
    name: d.string,
    size: d.number,
});
type MyResponse = d.TypeOf<typeof myResponseDecoder>;

const TelegramChatListItem: FC = () => {
    return (
        <p>мумуму прикоооол</p>
    );
};
const TelegramChatListSection: FC = () => {
    return (
        <div>
            <h1>Telegram chat list</h1>
            <p>This is the <strong>Test page</strong></p>
            <TelegramChatListItem></TelegramChatListItem>
            <TelegramChatListItem></TelegramChatListItem>
        </div>
    );
};

export default createModule(TelegramChatListSection);