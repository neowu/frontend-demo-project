import {Text, TextColor} from "app/component/library";
import {PickOptional} from "app/type/definition";
import React from "react";
import {StyleSheet, Text as NativeText} from "react-native";

interface Props {
    value: number | null;
    prefix?: string;
    postfix?: string;
    precision?: number;
    color?: TextColor;
    withDel?: boolean;
    withPlusSignForPositive?: boolean;
    withMinusSignForPositive?: boolean;
    withThousandSplitter?: boolean;
    baseSize?: number;
    hidePrecisionForBigNumber?: boolean;
    forcePrecision?: boolean;
}

export default class Amount extends React.PureComponent<Props> {
    public static defaultProps: PickOptional<Props> = {
        precision: 4,
        color: "body",
        withDel: false,
        withPlusSignForPositive: false,
        withMinusSignForPositive: false,
        withThousandSplitter: true,
        baseSize: 14,
        hidePrecisionForBigNumber: false,
        forcePrecision: false,
    };

    render() {
        const {value, precision, postfix, prefix, color, withDel, withThousandSplitter, withPlusSignForPositive, withMinusSignForPositive, baseSize, hidePrecisionForBigNumber, forcePrecision} = this.props;
        if (value !== null && !isNaN(value)) {
            const outerTextStyle = [{fontSize: baseSize}, withDel && styles.withDel];
            let parts: string[];
            if (value !== 0 || forcePrecision) {
                const realPrecision = hidePrecisionForBigNumber && value >= 100000 ? 0 : precision;
                parts = value.toFixed(realPrecision).split(".");
                if (withThousandSplitter) {
                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                if (withPlusSignForPositive && value > 0) {
                    parts[0] = "+" + parts[0];
                }
                if (withMinusSignForPositive && value > 0) {
                    parts[0] = "-" + parts[0];
                }
            } else {
                parts = ["0"];
            }

            // Integrate the style based on props
            const smallFontSize = baseSize! * 0.72;
            return (
                <Text style={outerTextStyle} color={color}>
                    {prefix && `${prefix} `}
                    {parts[0]}
                    {parts[1] && "."}
                    {parts[1] && <NativeText style={{fontSize: smallFontSize}}>{parts[1]}</NativeText>}
                    {postfix && ` ${postfix}`}
                </Text>
            );
        } else {
            return <Text>-</Text>;
        }
    }
}

const styles = StyleSheet.create({
    withDel: {
        textDecorationLine: "line-through",
    },
});
