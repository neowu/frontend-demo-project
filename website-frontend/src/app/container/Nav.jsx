import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Icon, Layout, Menu} from "antd";

const Nav = ({role}) => {
    function adminMenu() {
        return role === "admin" ? <Menu.SubMenu key="sub1" title={<span><Icon type="user"/>Users</span>}>
            <Menu.Item key="1"><Link to="/user-manage">Manage Users</Link></Menu.Item>
        </Menu.SubMenu> : "";
    }

    return <Layout.Sider width={200} style={{background: "#fff"}}>
        <Menu mode="inline" defaultSelectedKeys={["1"]} defaultOpenKeys={["sub2"]} style={{
            height: "100%",
            borderRight: 0
        }}>
            <Menu.Item key="6"><Link to="/">Home</Link></Menu.Item>
            {adminMenu()}
            <Menu.SubMenu key="sub2" title={<span><Icon type="laptop"/>Games</span>}>
                <Menu.Item key="2">Game1</Menu.Item>
                <Menu.Item key="3">Game2</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub3" title={<span><Icon type="appstore"/>Product</span>}>
                <Menu.Item key="4"><Link to="/product/list">List Products</Link></Menu.Item>
                <Menu.Item key="5"><Link to="/product/add">Add Product</Link></Menu.Item>
            </Menu.SubMenu>
        </Menu>
    </Layout.Sider>;
};

Nav.propTypes = {
    role: PropTypes.string
};

export default connect(state => ({
    role: state.user.currentUser.role
}))(Nav);
