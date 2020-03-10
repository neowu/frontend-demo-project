import {Alert, Button, Form, Input} from "antd";
import {FormProps} from "antd/lib/form";

import {actions} from "module/user";
import React from "react";
import {connect, DispatchProp} from "react-redux";
import {RootState} from "type/state";
import "./loginForm.less";

interface StateProps {
    errorMessage: string | null;
}

interface Props extends StateProps, FormProps, DispatchProp {}

const LoginForm: React.FunctionComponent<Props> = ({dispatch, errorMessage}: Props) => {
    const onFinish = (values: {[name: string]: string}) => {
        dispatch(actions.login(values.username, values.password));
    };

    return (
        <div>
            {errorMessage ? <Alert message="Login Failed" description={errorMessage} type="error" closable /> : null}
            <Form onFinish={onFinish} className="login-form">
                <Form.Item name="username" rules={[{required: true, message: "Please input your username!"}]}>
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item name="password" rules={[{required: true, message: "Please input your password!"}]}>
                    <Input type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const mapStateToProps = (state: RootState): StateProps => {
    return {
        errorMessage: state.app.user.login.errorMessage,
    };
};

export default connect(mapStateToProps)(LoginForm);
