import React from "react";
import {FC} from "react";
import {Route, Routes} from "react-router";
import {Page} from "./Page";
import {Link, NavLink} from "react-router-dom";
import {PageDefinition} from "../utils";

export interface ApplicationProps {
    pages: PageDefinition[];
}

export const Application: FC<ApplicationProps> = ({ pages }) => {
    const routes = pages.map(({ js, route }) => (
        <Route key={route} path={route} element={<Page key={route} path={js} />} />
    ));

    const links = pages.map(({ title, route }) => (
        <NavLink key={route} className="nav-link" to={route}>{title}</NavLink>
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
