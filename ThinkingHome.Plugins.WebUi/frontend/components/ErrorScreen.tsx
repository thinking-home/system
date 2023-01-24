import React from "react";
import {cn} from '@bem-react/classname';

import './ErrorScreen.css';

const cls = cn('ErrorScreen');

export interface ErrorScreenProps {
    message: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({message}) => {

    return (// TMP:
        <div className={cls()}>
            <div className={cls('Content', ['h1'])}>
                <span className={cls('Title')}>Error</span>
                <small className={cls('Message', ['text-muted'])}> {message}</small>
            </div>
        </div>
    );
}
