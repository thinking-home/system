import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {FC} from "react";
import {BrowserRouter} from "react-router-dom";


const onClick = () => alert('МУУУУУУ1');

const Application: FC = () => (
    <div onClick={onClick}>mu mu mu1</div>
);

const app = (
    <React.StrictMode>
        <BrowserRouter>
            <Application/>
        </BrowserRouter>
    </React.StrictMode>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(app);
