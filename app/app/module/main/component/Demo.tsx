import {Button, Text, Checkbox, OverlayManager} from "app/component/library";
import React from "react";
import {StyleSheet, SafeAreaView, View, ScrollView} from "react-native";
import {NavigationService} from "app/service/NavigationService";

const Box: React.SFC<{title: string}> = props => (
    <View style={styles.boxContainer}>
        <Text size="subtitle" bold color="blue">
            {props.title}
        </Text>
        <View style={styles.box}>{props.children}</View>
    </View>
);

interface State {
    checkboxValue: boolean;
}

export default class Demo extends React.PureComponent<{}, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            checkboxValue: true,
        };
    }

    checkBoxOnChange = (checkboxValue: boolean) => this.setState({checkboxValue});

    showActionModal1 = () => {
        OverlayManager.pushActionModal({
            body: "输入的账号或者密码有误，\n请重新输入",
        });
    };

    showActionModal2 = () => {
        OverlayManager.pushActionModal({
            body: "输入的账号或者密码有误，\n请重新输入",
            cancelText: "取消",
        });
    };

    showActionModal3 = async () => {
        const res = await OverlayManager.pushActionModalAsPromise({
            body: "输入的账号或者密码有误，\n请重新输入",
            cancelText: "取消",
        });
        console.info("=> Action Modal ", res);
        OverlayManager.pop();
    };

    render() {
        return (
            <SafeAreaView style={{backgroundColor: "#F2F2F2", flex: 1}}>
                <ScrollView>
                    <Button style={styles.buttonLogin} text="Login" onPress={() => NavigationService.switch("Login")} />
                    <Box title="Text">
                        <View>
                            <Text size="large" color="body">
                                body
                            </Text>
                            <Text size="large" color="blue">
                                blue
                            </Text>
                            <Text size="large" color="green">
                                green
                            </Text>
                            <Text size="large" color="lightBlue">
                                lightBlue
                            </Text>
                            <Text size="large" color="red">
                                red
                            </Text>
                            <Text size="large" color="weak">
                                weak
                            </Text>
                            <Text size="large" color="white">
                                white
                            </Text>
                            <Text size="large" color="none">
                                none
                            </Text>
                        </View>
                        <Text size="title">title</Text>
                        <Text size="subtitle">subtitle</Text>
                        <Text size="normal">normal</Text>
                        <Text size="small">small</Text>
                        <Text size="short">short</Text>
                    </Box>
                    <Box title="Checkbox">
                        <Checkbox checked={this.state.checkboxValue} disabled text="disabled" onChange={() => null} />
                        <Checkbox checked={this.state.checkboxValue} text="active" onChange={this.checkBoxOnChange} />
                    </Box>
                    <Box title="Button">
                        <Button text="Demo" />
                    </Box>
                    <Box title="Modal">
                        <Button text="ActionModal 1" onPress={this.showActionModal1} />
                        <Button text="ActionModal 2" onPress={this.showActionModal2} />
                        <Button text="ActionModal Promise" onPress={this.showActionModal3} />
                        <Button text="Toast" onPress={() => OverlayManager.toast("hello word")} />
                        <Button
                            text="Drawer"
                            onPress={() =>
                                OverlayManager.pushDrawer(
                                    <SafeAreaView>
                                        <Text size="large" color="blue">
                                            hello drawer
                                        </Text>
                                    </SafeAreaView>
                                )
                            }
                        />
                    </Box>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    buttonLogin: {
        width: "100%",
    },
    boxContainer: {
        padding: 20,
    },
    box: {
        borderTopWidth: 1,
        borderColor: "#ccc",
        marginTop: 10,
        paddingVertical: 10,
        alignItems: "flex-start",
    },
});
