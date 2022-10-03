import * as React from 'react';
import {FC, useCallback, useState} from 'react';
import { createModule } from '@thinking-home/ui';

const TmpSection: FC = () => {
    const [error, setError] = useState(false);
    
    const onClick = useCallback(() => {
        setError(true);
    }, []);
    
    if (error) {
        throw new Error("moo");
    }
    
    return (
        <div>
            <p>mi mi mi — <strong>Tmp plugin</strong></p>
            <div>
                <button onClick={onClick}>Create error</button>
            </div>
        </div>
    );
};


export default createModule(TmpSection);
