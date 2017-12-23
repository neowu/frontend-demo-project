import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

const Nav = ({role}) =>
    <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            {role === "admin" ? <li><Link to="/user-manage">Manage Users</Link></li> : ""}
        </ul>
    </nav>;

Nav.propTypes = {
    role: PropTypes.string
};

export default connect(state => ({
    role: state.currentUser.role
}))(Nav);
