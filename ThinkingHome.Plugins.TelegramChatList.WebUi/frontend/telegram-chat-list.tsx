import * as React from 'react';
import {FC} from 'react';
import {createModule} from '@thinking-home/ui';

const MySection: FC = () => {
    return (
        <div>
            <h1>Telegram chat list</h1>
            <p>This is the <strong>Test page</strong></p>
        </div>
    );
};

export default createModule(MySection);