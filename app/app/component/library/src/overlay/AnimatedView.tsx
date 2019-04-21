import React from "react";
import {StyleProp, ViewStyle} from "react-native";
import * as Animatable from "react-native-animatable";

interface Props {
    visible: boolean;
    animations: [string, string];
    style?: StyleProp<ViewStyle>;
}

interface State {
    displayStatus: "normal" | "in" | "out" | "none";
}

export default class AnimatedView extends React.PureComponent<Props, State> {
    private shouldUpdateNoneStateAfterAnimation = true;

    constructor(props: Props) {
        super(props);
        this.state = {displayStatus: props.visible ? "in" : "none"};
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.visible && !this.props.visible) {
            this.setState({displayStatus: "out"});
        } else if (!prevProps.visible && this.props.visible) {
            this.setState({displayStatus: "in"});
        }
    }

    componentWillUnmount() {
        // If AnimatedView is contained in another AnimatedView, the parent's hiding animation MAY trigger earlier than children.
        // In this case, the children is un-mounted before calling onAnimationEnd.
        // To avoid warning, the state update should be skipped on children, safely.
        this.shouldUpdateNoneStateAfterAnimation = false;
    }

    onAnimationEnd = () => {
        if (this.props.visible) {
            this.setState({displayStatus: "normal"});
        } else if (this.shouldUpdateNoneStateAfterAnimation) {
            this.setState({displayStatus: "none"});
        }
    };

    render() {
        const {animations, style, children} = this.props;
        const {displayStatus} = this.state;
        const animationName = displayStatus === "in" ? animations[0] : displayStatus === "out" ? animations[1] : "";
        if (displayStatus === "none") {
            return null;
        }

        return (
            <Animatable.View pointerEvents={displayStatus === "normal" ? "auto" : "box-only"} useNativeDriver duration={300} onAnimationEnd={this.onAnimationEnd} animation={animationName} style={style}>
                {children}
            </Animatable.View>
        );
    }
}
