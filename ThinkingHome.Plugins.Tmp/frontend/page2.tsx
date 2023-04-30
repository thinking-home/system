import * as React from 'react';
import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {createModule, useAppContext} from '@thinking-home/ui';
import * as d from 'io-ts/Decoder';

const url = '/api/tmp/pigs';
const tmpPigDecoder = d.struct({
    id: d.string,
    name: d.string,
    size: d.number,
});

type Pig = d.TypeOf<typeof tmpPigDecoder>;

const tmpResponseDecoder = d.array(tmpPigDecoder);

const TmpSection: FC = () => {
    const [list, setList] = useState<Pig[]>([]);
    const {api} = useAppContext();
    const controller = useMemo(() => new AbortController(), []);

    useEffect(() => {
        api.get(tmpResponseDecoder, {url, signal: controller.signal})
            .then(setList, (e) => console.error(e));

        return () => controller.abort();
    }, [controller]);

    const cancel = useCallback(() => controller.abort(), [controller]);

    const content = list.length ? (
        <ul>
            {list.map(pig => <li>{pig.name} ({pig.size})</li>)}
        </ul>
    ) : <div>LOADING...</div>;

    const cancelButton = list.length ? undefined : (
        <p>
            <button onClick={cancel}>Cancel request</button>
        </p>
    );

    return (
        <div>
            <p>This is the <strong>Test page 2</strong> (from <code>Tmp plugin</code>)</p>
            {cancelButton}
            {content}
        </div>
    );
};

export default createModule(TmpSection);
