import React, {PureComponent} from "react";
import PropTypes from "prop-types";

import logo from "../../assets/img/logo.svg";

export default class Header extends PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        title2: PropTypes.string
    };

    render() {
        const {title} = this.props;
        return <header>
            <h1>this is header, {title}</h1>
            <img id="logo" src={logo}/>
        </header>;
    }
}
