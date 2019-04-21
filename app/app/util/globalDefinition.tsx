import React from "react";
import {StyleSheet} from "react-native";

/**
 * Style definition
 */
export const globalStyles = StyleSheet.create({
    // Global
    flex1: {flex: 1},
    flex2: {flex: 2},
    flex3: {flex: 3},
    flexRow: {flexDirection: "row", alignItems: "flex-start"},
    flex1Center: {flex: 1, justifyContent: "center", alignItems: "center"},
    bold: {fontWeight: "bold"},
    transparent: {opacity: 0},
    absoluteFillCenter: {...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center"},
    launchingURLContainer: {height: 44, width: 200, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderRadius: 8},
});

export const commonStyles = {
    gradient: {
        blueProps: {colors: ["rgb(19,126,250)", "rgb(62,187,251)"], start: {x: 0, y: 1}, end: {x: 1, y: 1}, locations: [0, 1]},
        whiteProps: {colors: ["#ffffff", "#ffffff"], locations: [0, 1]},
        grayPureProps: {colors: ["#dddddd", "#dddddd"], locations: [0, 1]},
        greenProps: {colors: ["rgb(92,201,179)", "rgb(51,170,146)"], start: {x: 0, y: 1}, end: {x: 1, y: 1}, locations: [0, 1]},
        indigoProps: {colors: ["#4d5585", "#4d5585"], locations: [0, 1]},
        yellowProps: {colors: ["rgb(255,176,51)", "rgb(255,193,104)"], start: {x: 0, y: 1}, end: {x: 1, y: 1}, locations: [0, 1]},
        redProps: {colors: ["rgb(239,109,125)", "rgb(231,55,76)"], start: {x: 0, y: 1}, end: {x: 1, y: 1}, locations: [0, 1]},
    },
    number: {
        modalRadius: 6,
        inputRadius: 4,
        buttonRadius: 4,
    },
    backgroundColor: {
        input: "#fff",
        inputDisabled: "#ddd",
    },
    textColor: {
        body: "rgb(65, 69, 98)",
        weak: "rgb(160, 162, 176)",
        blue: "rgb(0, 122, 255)",
        lightBlue: "rgb(76, 177, 255)",
        white: "rgb(255, 255, 255)",
        red: "rgb(231, 55, 76)",
        green: "rgb(51, 170, 146)",
        none: undefined,
    },
};
/**
 * Hit-slop definition
 */
const hitSlopOffset = 8;
export const globalHitSlop = {right: hitSlopOffset, top: hitSlopOffset, left: hitSlopOffset, bottom: hitSlopOffset};
