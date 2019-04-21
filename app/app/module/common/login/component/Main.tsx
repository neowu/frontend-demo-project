import React from "react";
import {StyleSheet, View, Text} from "react-native";
import {connect, DispatchProp} from "react-redux";
import {Button, FormRow, IconClass, Input} from "app/component/library";
import {InputValidator} from "app/service/InputValidator";
import {actions as mainActions} from "app/module/main";
import {NavigationService} from "app/service/NavigationService";

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
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text>LOGO</Text>
                </View>
                <View style={styles.loginContainer}>
                    <FormRow errorMessage={nameErrorMessage}>
                        <Input value={username} containerStyle={styles.input} prefixIcon={IconClass.USER} onBlur={this.validateUsername} onChangeText={this.onChangeUsername} placeholder="user" showWarningBorder={!!nameErrorMessage} />
                    </FormRow>
                    <FormRow errorMessage={passwordErrorMessage}>
                        <Input value={password} containerStyle={styles.input} allowTogglePasswordMask showWarningBorder={!!passwordErrorMessage} secureTextEntry onBlur={this.validatePassword} placeholder="password" prefixIcon={IconClass.LOCK} onChangeText={this.onChangePassword} />
                    </FormRow>
                    <View style={styles.loginButton}>
                        <Button size={"large"} text={"登录"} onPress={this.login} />
                        <Button size={"large"} text={"Demo"} onPress={() => NavigationService.switch("Demo")} style={{marginTop: 20}} />
                    </View>
                </View>
            </View>
        );
    }
}

export default connect()(LoginMain);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        height: 355,
    },
    loginContainer: {
        alignItems: "center",
    },
    password: {
        marginTop: 13,
    },
    loginButton: {
        marginTop: 80,
    },
    input: {
        backgroundColor: "rgb(241, 245, 253)",
        width: 290,
    },
    captchaInput: {
        width: 380,
    },
});
