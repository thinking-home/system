import React from "react";
import {FC} from "react";
import {Page} from "./Page";
import {Routes, Route} from "react-router";
import {Link, NavLink, useLocation} from "react-router-dom";
import {cn} from '@bem-react/classname';
import {Gear, Grid3} from '@thinking-home/icons';

import {ErrorScreen} from "./ErrorScreen";
import {PageDefinition} from "../utils";

import './Application.css';

const cls = cn('Application');

export interface ApplicationProps {
    pages: Record<string, PageDefinition>;
}

const Home: React.FC = () => (
    <div>
        <h1>Home</h1>
        <p className="muted">
            Placeholder text to demonstrate some
            <a href="#" data-bs-toggle="tooltip" data-bs-title="Default tooltip">inline links</a>
            with tooltips. This is now just filler, no killer. Content placed here just to mimic
            the presence of <a href="#" data-bs-toggle="tooltip" data-bs-title="Another tooltip">real text</a>.
            And all that just to give you an idea of how tooltips would look when used in real-world situations.
            So hopefully you've now seen how
            <a href="#" data-bs-toggle="tooltip" data-bs-title="Another one here too">these tooltips on links</a>
            can work in practice, once you use them on
            <a href="#" data-bs-toggle="tooltip" data-bs-title="The last tip!">your own</a> site or project.
        </p>
    </div>
);

export const Content: React.FC<{ pages: Record<string, PageDefinition> }> = ({pages}) => {
    const {pathname} = useLocation();
    const def = pages[pathname];

    if (def) {
        return <Page key={pathname} path={def.js}/>;
    }

    return <ErrorScreen message='Page not found'/>;
}

export const Application: FC<ApplicationProps> = ({pages}) => {
    return (
        <div className={cls()}>
            <nav className="navbar navbar-expand-sm bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Logo</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <NavLink className="nav-link" to='/'>Home</NavLink>
                            <NavLink className="nav-link" to='/apps'>
                                <Grid3 />
                            </NavLink>
                            <NavLink className="nav-link" to='/settings'>
                                <Gear />
                            </NavLink>
                            <NavLink className="nav-link" to='/moo'>TMP: MOO</NavLink>
                        </div>
                    </div>
                </div>
            </nav>
            <div className={cls('Content', ['container-fluid'])}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/apps" element={<div>apps</div>}/>
                    <Route path="/settings" element={<div>settings</div>}/>
                    <Route path="*" element={<Content pages={pages}/>}/>
                </Routes>
            </div>
        </div>
    );
}
