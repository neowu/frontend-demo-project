import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

class Header extends React.PureComponent {
    componentDidMount() {
        this.props.dispatch({type: "CHECK_LOGIN"});
    }

    render() {
        const loggedIn = this.props.loggedIn;
        if (loggedIn) {
            return <header>Hello {this.props.userName}</header>;
        }
        return <header>Not Login
            <Link to="/login">login</Link>
        </header>;
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
