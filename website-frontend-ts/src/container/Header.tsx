import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Button, Layout, Menu} from "antd";
import {Dispatch} from "redux";

const css = require("./header.less");

interface Props {
    loggedIn: boolean;
    userName: string;
    logout: () => void;
}

const Header: React.SFC<Props> = ({logout, loggedIn, userName}) => {
    const loginMenu = () =>
        <Menu mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
                <Link to={"/login"}>Login</Link>
            </Menu.Item>
        </Menu>;

    return <Layout.Header className={css.header}>
        {loggedIn ? <div>Hello {userName}, <Button onClick={logout}>Logout</Button></div> : loginMenu()}
    </Layout.Header>;
};

const mapStatsToProps = (state: any) => ({
    loggedIn: state.user.currentUser.loggedIn,
    userName: state.user.currentUser.name,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    logout: () => {
        dispatch({type: "LOGOUT"});
    }
});
export default connect(mapStatsToProps, mapDispatchToProps)(Header);
