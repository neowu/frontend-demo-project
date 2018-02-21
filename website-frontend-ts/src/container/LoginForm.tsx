import React from "react";
import {connect} from "react-redux";
import {Alert, Button, Form, Input} from "antd";
import {Dispatch} from "redux";
import {FormComponentProps} from "antd/lib/form";

const css = require("./loginForm.less");

interface Props extends FormComponentProps {
    errorMessage?: string;
    dispatch: Dispatch<any>;
}

const LoginForm: React.SFC<Props> = ({dispatch, form, errorMessage}) => {
    const onSubmit = (event) => {
        event.preventDefault();
        form.validateFields((errors, values) => {
            if (!errors) {
                dispatch({
                    type: "LOGIN",
                    request: {
                        username: values.username,
                        password: values.password
                    }
                });
            }
        });
    };

    const usernameDecorator = form.getFieldDecorator("username", {
        rules: [{
            required: true,
            message: "Please input your username!"
        }]
    });

    const passwordDecorator = form.getFieldDecorator("password", {
        rules: [{
            required: true,
            message: "Please input your Password!"
        }]
    });

    return <div>
        {errorMessage ? <Alert message="Login Failed" description={errorMessage} type="error" closable/> : null}
        <Form onSubmit={onSubmit} className={css["login-form"]}>
            <Form.Item>
                {usernameDecorator(<Input placeholder="Username"/>)}
            </Form.Item>
            <Form.Item>
                {passwordDecorator(<Input type="password" placeholder="Password"/>)}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className={css["login-form-button"]}>Log in</Button>
            </Form.Item>
        </Form>
    </div>;
};

export default connect((state: any) => ({
    errorMessage: state.user.login.errorMessage
}))(Form.create()(LoginForm) as any);
