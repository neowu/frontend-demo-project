import React from "react";
// import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Button, Layout, Menu} from "antd";

const css = require("./header.less");

const Header = ({dispatch, loggedIn, userName}) => {
    const loginMenu = () =>
        <Menu mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
                <Link to={"/login"}>Login</Link>
            </Menu.Item>
        </Menu>;

    function logout() {
        return dispatch({type: "LOGOUT"});
    }

    return <Layout.Header className={css.header}>
        {loggedIn ? <div>Hello {userName}, <Button onClick={logout}>Logout</Button></div> : loginMenu()}
    </Layout.Header>;
};

// Header.propTypes = {
//     loggedIn: PropTypes.bool,
//     userName: PropTypes.string,
//     dispatch: PropTypes.func
// };

export default connect((state: any) => ({
    loggedIn: state.user.currentUser.loggedIn,
    userName: state.user.currentUser.name
}))(Header);
