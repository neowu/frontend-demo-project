import PropTypes from "prop-types";
import React from "react";

export default class Header extends React.Component {
    render() {
        const {title} = this.props;
        return <header>
            <h1>this is header, {title}</h1>
        </header>;
    }
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    title2: PropTypes.string
};