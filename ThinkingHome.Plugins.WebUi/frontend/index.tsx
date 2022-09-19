import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import {Application} from "./components/Application";

const app = (
    <React.StrictMode>
        <BrowserRouter>
            <Application/>
        </BrowserRouter>
    </React.StrictMode>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(app);
