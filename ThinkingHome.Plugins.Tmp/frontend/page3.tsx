import * as React from 'react';
import {FC, useCallback} from 'react';
import {createModule, useAppContext, useMessageHandler} from '@thinking-home/ui';
import * as d from 'io-ts/Decoder';

const tmpPigDecoder = d.struct({
    name: d.string,
    size: d.number,
});

type TmpPig = d.TypeOf<typeof tmpPigDecoder>;

const TOPIC = 'mh-example';
const TmpSection: FC = () => {
    const {messageHub: {send}, toaster: {showInfo}} = useAppContext();

    const handler = useCallback((topic: string, guid: string, timestamp: string, data: TmpPig) => {
        const content = (
            <>
                <div><strong>New Message:</strong></div>
                <div>topic: {topic}</div>
                <div>guid: {guid}</div>
                <div>timestamp: {timestamp}</div>
                <div>pig: {data.name}</div>
                <div>size: {data.size}</div>
            </>
        );

        showInfo(content);
    }, [showInfo]);

    useMessageHandler(TOPIC, tmpPigDecoder, handler);

    const onClick = useCallback(() => {
        const name = prompt('Enter the name of the pig');
        send<TmpPig>(TOPIC, {name, size: 42});

    }, [send]);

    return (
        <div>
            <button onClick={onClick}>Send pig message</button>
        </div>
    );
};

export default createModule(TmpSection);
