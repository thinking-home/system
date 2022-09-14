import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {FC} from "react";
import {BrowserRouter} from "react-router-dom";


const Application: FC = () => (
    <div>mu mu mu</div>
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
