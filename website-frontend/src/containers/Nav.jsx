import React from "react";
import {Link} from "react-router-dom";

const Nav = () =>
    <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    </nav>;

export default Nav;
