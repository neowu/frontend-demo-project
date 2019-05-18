import {actions as mainActions} from "app/module/main";
import {Button, Container, Content, Form, Input, Item, Text} from "native-base";
import React from "react";
import {connect, DispatchProp} from "react-redux";

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

    login = () => {
        const {username, password} = this.state;
        this.props.dispatch(mainActions.login({username, password}));
    };

    render() {
        const {username, password, nameErrorMessage, passwordErrorMessage} = this.state;
        return (
            <Container>
                <Content>
                    <Form>
                        <Item>
                            <Input placeholder="Username" onChangeText={this.onChangeUsername} autoCapitalize={"none"} autoCorrect={false} />
                        </Item>
                        <Item last>
                            <Input placeholder="Password" onChangeText={this.onChangePassword} secureTextEntry />
                        </Item>
                        <Button onPress={this.login}>
                            <Text>Login</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }
}

export default connect()(LoginMain);
