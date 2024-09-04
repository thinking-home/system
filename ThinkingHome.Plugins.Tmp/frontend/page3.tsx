import * as React from 'react';
import {FC, useCallback, useState} from 'react';

import {
    createModule,
    LogLevel,
    ReceivedMessage,
    useAppContext,
    useLogger,
    useMessageHandler,
    useKeyset
} from '@thinking-home/ui';
import * as d from 'io-ts/Decoder';
import {Keyset, text} from "@thinking-home/i18n";

const tmpPigDecoder = d.struct({
    name: d.string,
    size: d.number,
});

type TmpPig = d.TypeOf<typeof tmpPigDecoder>;

const TOPIC = 'mh-example';

const keyset = new Keyset("en", {
    incement: text('Incement'),
    sendPigMessage: text('Send pig message'),
});

const TmpPigToast: FC<{ msg: ReceivedMessage<TmpPig>, counter: number }> = (e) => {
    const {msg: {topic, guid, timestamp, data: {name, size}}, counter} = e;
    
    return (
        <>
            <div><strong>Message</strong></div>
            <div>Current value: {counter}</div>
            <div>topic: {topic}</div>
            <div>guid: {guid}</div>
            <div>timestamp: {timestamp}</div>
            <div>pig: {name} (size: {size})</div>
        </>
    );
}
const TmpSection: FC = () => {
    const {t} = useKeyset(keyset);
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
            <button onClick={onClick}>{t('sendPigMessage')}</button>
            <button onClick={onIncement}>{t('incement')}</button>
        </div>
    );
};

export default createModule(TmpSection);
