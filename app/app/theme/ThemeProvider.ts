import {ButtonColor} from "app/component/library";
import {LinearGradientProps} from "react-native-linear-gradient";

export class ThemeProvider {
    static getTextColor(theme: string, key: any): string {
        return "#000000";
    }

    static getBorderColor(theme: string, key: any): string | undefined {
        return "#000000";
    }

    static getGradientProps(theme: string, key: any): LinearGradientProps {
        return {colors: ["#ff2262", "#ff8144"], start: {x: 0, y: 1}, end: {x: 1, y: 1}, locations: [0, 1]};
    }

    static getButtonColor(theme: string, key: any): ButtonColor {
        return "blue";
    }

    static getBackgroundColor(theme: string, key: any): string {
        return "#ff8144";
    }
}
