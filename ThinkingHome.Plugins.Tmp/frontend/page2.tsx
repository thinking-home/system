import * as React from 'react';
import {FC, useEffect, useState} from 'react';
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
    const { api } = useAppContext();
    
    useEffect(() => {
        api.get(tmpResponseDecoder, { url }).then(setList)
    }, []);
    
    const content = list.length ? (
        <ul>
            {list.map(pig => <li>{pig.name} ({pig.size})</li>)}
        </ul>
    ) : <div>LOADING...</div>;
    
    return (
        <div>
            <p>This is the <strong>Test page 2</strong> (from <code>Tmp plugin</code>)</p>
            {content}
        </div>
    );
};

export default createModule(TmpSection);
