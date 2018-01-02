import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {Alert, Button, Form, Input} from "antd";
import css from "./loginForm.less";

class LoginForm extends React.Component {
    onSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.props.dispatch({
                    type: "LOGIN",
                    username: values.username,
                    password: values.password
                });
            }
        });
    };

    render() {
        if (this.props.loginSuccess) {
            return <Redirect to={"/"}/>;
        }

        const {getFieldDecorator} = this.props.form;

        return <div>
            {this.props.loginError ? <Alert message="Login Failed" description={this.props.loginError} type="error" closable/> : null}
            <Form onSubmit={this.onSubmit} className={css["login-form"]}>
                <Form.Item>
                    {getFieldDecorator("username", {
                        rules: [{
                            required: true,
                            message: "Please input your username!"
                        }]
                    })(
                        <Input placeholder="Username"/>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator("password", {
                        rules: [{
                            required: true,
                            message: "Please input your Password!"
                        }]
                    })(
                        <Input type="password" placeholder="Password"/>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className={css["login-form-button"]}>Log in</Button>
                </Form.Item>
            </Form>
        </div>;
    }
}

LoginForm.propTypes = {
    dispatch: PropTypes.func,
    loginSuccess: PropTypes.bool,
    loginError: PropTypes.string,
    form: PropTypes.object
};

export default connect(state => ({
    loginSuccess: state.user.login.success,
    loginError: state.user.login.error
}))(Form.create()(LoginForm));
