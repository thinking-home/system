import React, {useEffect} from "react";
import {FC, useState} from "react";
import {Route, Routes} from "react-router";
import {Page} from "./Page";
import {Link, NavLink} from "react-router-dom";

export interface PageDefinition {
    route: string;
    path: string;
    name: string;
}

export async function getPages(): Promise<PageDefinition[]> {
    const sections: PageDefinition[] = [
        {
            route: '/moo',
            path: '/static/webui/js/moo.js',
            name: 'Plugin moo',
        },
        {
            route: '/hru',
            path: '/static/webui/js/moo.js',
            name: 'Plugin hru',
        },
        {
            route: '/meow',
            path: '/static/webui/js/moo.js',
            name: 'Plugin meow',
        },
    ];

    return Promise.resolve(sections);
}

export const Application: FC = () => {
    const [sections, setSections] = useState<PageDefinition[]>([]);

    useEffect(() => {
        getPages().then(setSections);
    }, []);

    const routes = sections.map(({ path, route }) => (
        <Route key={route} path={route} element={<Page key={route} path={path} />} />
    ));

    const links = sections.map(({ name, route }) => (
        <NavLink key={route} className="nav-link" to={route}>{name}</NavLink>
    ));

    const home = (
        <div>
            <h1>Home</h1>
            <p className="muted">Placeholder text to demonstrate some <a href="#" data-bs-toggle="tooltip" data-bs-title="Default tooltip">inline links</a> with tooltips. This is now just filler, no killer. Content placed here just to mimic the presence of <a href="#" data-bs-toggle="tooltip" data-bs-title="Another tooltip">real text</a>. And all that just to give you an idea of how tooltips would look when used in real-world situations. So hopefully you've now seen how <a href="#" data-bs-toggle="tooltip" data-bs-title="Another one here too">these tooltips on links</a> can work in practice, once you use them on <a href="#" data-bs-toggle="tooltip" data-bs-title="The last tip!">your own</a> site or project.
            </p>
        </div>
    );

    return (
        <div>
            <nav className="navbar navbar-expand-sm bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Logo</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <NavLink className="nav-link" to='/'>Home</NavLink>
                            {links}
                        </div>
                    </div>
                </div>
            </nav>
            <div className="container-fluid">
                <Routes>
                    <Route path='/' element={home} />
                    {routes}
                </Routes>
            </div>
        </div>
    );
}
