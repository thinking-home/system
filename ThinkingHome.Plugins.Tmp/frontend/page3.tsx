import * as React from 'react';
import {FC, useCallback, useState} from 'react';
import {createModule, LogLevel, ReceivedMessage, useAppContext, useLogger, useMessageHandler} from '@thinking-home/ui';
import * as d from 'io-ts/Decoder';

const tmpPigDecoder = d.struct({
    name: d.string,
    size: d.number,
});

type TmpPig = d.TypeOf<typeof tmpPigDecoder>;

const TOPIC = 'mh-example';

const TmpPigToast: FC<{ msg: ReceivedMessage<TmpPig>, counter: number }> = (e) => {
    const {msg: {topic, guid, timestamp, data: {name, size}}, counter} = e;

    return (
        <>
            <div><strong>New Message:</strong></div>
            <div>CURRENT VALUE: {counter}</div>
            <div>topic: {topic}</div>
            <div>guid: {guid}</div>
            <div>timestamp: {timestamp}</div>
            <div>pig: {name}</div>
            <div>size: {size}</div>
        </>
    );
}
const TmpSection: FC = () => {
    const {messageHub: {send}, toaster: {showInfo}} = useAppContext();
    const [value, setValue] = useState(0);
    const logger = useLogger();

    useMessageHandler(TOPIC, tmpPigDecoder, (msg) => {
        showInfo(<TmpPigToast msg={msg} counter={value}/>);
        logger.log(LogLevel.Information, 'message was received')
    }, [showInfo, value, logger]);

    const onClick = useCallback(() => {
        const name = prompt('Enter the name of the pig');
        send<TmpPig>(TOPIC, {name, size: value});
        logger.log(LogLevel.Information, 'button has been pressed')
    }, [send, value, logger]);

    const onIncement = useCallback(() => {
        setValue(value + 1);
    }, [value, setValue]);

    return (
        <div>
            <p>Current value: {value}</p>
            <button onClick={onClick}>Send pig message</button>
            <button onClick={onIncement}>Incement</button>
        </div>
    );
};

export default createModule(TmpSection);
