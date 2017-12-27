import React from "react";
import PropTypes from "prop-types";

import "./header.less";

const Header = ({title}) =>
    <header>
        <h1>this is header, {title}</h1>
        <img id="logo"/>
        {" "}
        <a href="/page1">page 1</a>
        {" "}
        <a href="/page2">page 2</a>
        {" "}
        <a href="/page3">page 3</a>
    </header>;

Header.propTypes = {title: PropTypes.string.isRequired};

export default Header;
