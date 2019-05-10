import React from "react";
import {connect, DispatchProp} from "react-redux";
import {InputValidator} from "app/service/InputValidator";
import {actions as mainActions} from "app/module/main";
import { Container, Header, Content, Form, Item, Input } from "native-base";

interface StateProps {}

interface Props extends StateProps, DispatchProp {}

interface State {
    username: string;
    password: string;
    nameErrorMessage: string | null;
    passwordErrorMessage: string | null;
}

class LoginMain extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            nameErrorMessage: null,
            passwordErrorMessage: null,
        };
    }

    onChangeUsername = (username: string) => this.setState({username});

    onChangePassword = (password: string) => this.setState({password});

    validateUsername = () => {
        const nameErrorMessage = InputValidator.validateUsername(this.state.username);
        this.setState({nameErrorMessage});
        return nameErrorMessage === null;
    };

    validatePassword = () => {
        const passwordErrorMessage = InputValidator.validatePassword(this.state.password);
        this.setState({passwordErrorMessage});
        return passwordErrorMessage === null;
    };

    login = () => {
        const {username, password} = this.state;
        const validators = [this.validateUsername(), this.validatePassword()];
        if (validators.every(_ => _)) {
            this.props.dispatch(mainActions.login({username, password}));
        }
    };

    render() {
        const {username, password, nameErrorMessage, passwordErrorMessage} = this.state;
        return (
            <Container>
                <Header />
                <Content>
                    <Form>
                        <Item>
                            <Input placeholder="Username" />
                        </Item>
                        <Item last>
                            <Input placeholder="Password" />
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}

export default connect()(LoginMain);
