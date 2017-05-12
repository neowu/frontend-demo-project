import logo from "../../assets/img/logo.svg";
import PropTypes from "prop-types";
import React from "react";

export default class Header extends React.Component {
    render() {
        const {title} = this.props;
        return <header>
            <h1>this is header, {title}</h1>
            <img src={logo}/>
        </header>;
    }
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    title2: PropTypes.string
};