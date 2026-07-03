import * as React from 'react';
import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {createModule, LogLevel, useAppContext, useLogger} from '@thinking-home/ui';
import * as v from 'valibot';

const url = '/api/tmp/pigs';
const tmpPigSchema = v.object({
    id: v.string(),
    name: v.string(),
    size: v.number(),
});

type Pig = v.InferOutput<typeof tmpPigSchema>;

const tmpResponseSchema = v.array(tmpPigSchema);

const TmpSection: FC = () => {
    const [list, setList] = useState<Pig[]>([]);
    const {api} = useAppContext();
    const controller = useMemo(() => new AbortController(), []);
    const logger = useLogger();

    useEffect(() => {
        api.get(tmpResponseSchema, {url, signal: controller.signal})
            .then(setList, (e) => logger.log(LogLevel.Error, e instanceof Error ? e.message : 'error'));

        return () => controller.abort();
    }, [controller, logger]);

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
