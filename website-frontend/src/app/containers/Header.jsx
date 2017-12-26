import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Button, Layout, Menu} from "antd";

const Header = ({dispatch, loggedIn, userName}) => {
    function loginMenu() {
        return <Menu mode="horizontal" defaultSelectedKeys={["1"]} style={{lineHeight: "64px"}}>
            <Menu.Item key="1">
                <Link to={"/login"}>Login</Link>
            </Menu.Item>
        </Menu>;
    }

    function logout() {
        return dispatch({type: "LOGOUT"});
    }

    return <Layout.Header className="header" style={{
        background: "#fff",
        padding: 0
    }}>
        {loggedIn ? <div>Hello {userName}, <Button onClick={logout}>Logout</Button></div> : loginMenu()}
    </Layout.Header>;
};

Header.propTypes = {
    loggedIn: PropTypes.bool,
    userName: PropTypes.string,
    dispatch: PropTypes.func
};

export default connect(state => ({
    loggedIn: state.currentUser.loggedIn,
    userName: state.currentUser.name
}))(Header);
