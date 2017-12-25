import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Button, Menu} from "semantic-ui-react";

class Header extends React.PureComponent {
    render() {
        const loggedIn = this.props.loggedIn;
        if (loggedIn) {
            return <Menu><Menu.Item>Hello {this.props.userName}</Menu.Item></Menu>;
        }
        return <Menu>
            <Menu.Menu position="right">
                <Button primary as={Link} to={"/login"}>Login</Button>
            </Menu.Menu>
        </Menu>;
    }
}

Header.propTypes = {
    loggedIn: PropTypes.bool,
    userName: PropTypes.string,
    dispatch: PropTypes.func
};

export default connect(state => ({
    loggedIn: state.currentUser.loggedIn,
    userName: state.currentUser.name
}))(Header);
