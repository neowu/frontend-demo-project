import {ThemeProvider} from "app/theme/ThemeProvider";
import {PickOptional} from "app/type/definition";
import {joinReactNodes} from "app/util/default";
import React from "react";
import {ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";
import LinearGradient, {LinearGradientProps} from "react-native-linear-gradient";
import {memoizeTheme, ThemeContext} from "../theme";
import Touchable from "../Touchable";
import TabsPane, {TabsPaneProps} from "./TabsPane";

type Size = "large" | "medium";
type TabsPaneElement = React.ReactElement<TabsPaneProps>;

interface Props {
    activeKey: string;
    onChangeTab: (activeKey: string) => void;
    size?: Size;
    direction?: "vertical" | "horizontal";
    containerStyle?: StyleProp<ViewStyle>;
    tabBarStyle?: StyleProp<ViewStyle>;
    singleTabStyle?: StyleProp<ViewStyle>;
    tabContentStyle?: StyleProp<ViewStyle>;
    allowTabBarScrolling?: boolean; // only work when direction === "vertical"
}

export default class Tabs extends React.PureComponent<Props> {
    public context!: React.ContextType<typeof ThemeContext>;
    public static contextType = ThemeContext;
    public static Pane = TabsPane;
    public static defaultProps: PickOptional<Props> = {
        size: "large",
        direction: "horizontal",
    };

    private readonly scrollTabBarRef: React.RefObject<ScrollView>;

    constructor(props: Props) {
        super(props);
        this.scrollTabBarRef = React.createRef();
    }

    scrollTabBarIntoView = () => {
        const {activeKey, children} = this.props;
        const activeTabKeyIndex = React.Children.map(children, item => {
            if (item) {
                return (item as TabsPaneElement).props.tabKey;
            }
        }).findIndex(_ => _ === activeKey);
        if (activeTabKeyIndex > 4 && this.scrollTabBarRef.current) {
            this.scrollTabBarRef.current.scrollToEnd({animated: false});
        }
    };

    renderTabBar = () => {
        const {children, singleTabStyle, direction, onChangeTab, activeKey, size} = this.props;
        const {themeName} = this.context;
        const styles = styleMapper(themeName);
        const sizeStyle = sizeRelatedStyles[size!];

        // Generate tab bar elements
        const tabBarItems = React.Children.map(children, item => {
            if (item) {
                const tabsPane = item as TabsPaneElement;
                const tabKey = tabsPane.props.tabKey;
                const isActive = activeKey === tabKey;
                const tabProps = ThemeProvider.getGradientProps(themeName, isActive ? "tabActive" : "tabInactive");
                return (
                    <LinearGradient {...tabProps} key={tabKey} style={[styles.tabBarGradient, sizeStyle, singleTabStyle]}>
                        <Touchable enableHitSlop={false} disabled={isActive} onPress={() => onChangeTab(tabKey)} style={styles.tabBarTextContainer}>
                            <Text style={isActive ? styles.tabBarActiveText : styles.tabBarInactiveText}>{tabsPane.props.title}</Text>
                        </Touchable>
                    </LinearGradient>
                );
            }
        });

        // Generate tab bar separator
        const gradientProps: LinearGradientProps = {
            ...ThemeProvider.getGradientProps(themeName, "tabBorder"),
            style: direction === "horizontal" ? styles.tabItemBorderVertical : styles.tabItemBorderHorizontal,
        };
        if (direction === "vertical") {
            gradientProps.start = {x: 0, y: 0};
            gradientProps.end = {x: 1, y: 0};
        }
        const tabBarSeparator = <LinearGradient {...gradientProps} />;

        // Join together
        return joinReactNodes(tabBarItems, tabBarSeparator);
    };

    render() {
        const {direction, containerStyle, tabBarStyle, tabContentStyle, children, activeKey, allowTabBarScrolling} = this.props;
        const {themeName} = this.context;
        const styles = styleMapper(themeName);
        const isHorizontalTabs = direction === "horizontal";
        let matchedTabPane: TabsPaneElement | null = null;
        React.Children.forEach(children, item => {
            if (item) {
                const tabPane = item as TabsPaneElement;
                if (tabPane.props.tabKey === activeKey) {
                    matchedTabPane = tabPane;
                }
            }
        });

        return (
            <View style={[styles.flex1, containerStyle, !isHorizontalTabs && styles.flexRow]}>
                <View style={[tabBarStyle, isHorizontalTabs && styles.flexRow]}>
                    {allowTabBarScrolling && !isHorizontalTabs ? (
                        <ScrollView onContentSizeChange={this.scrollTabBarIntoView} ref={this.scrollTabBarRef}>
                            {this.renderTabBar()}
                        </ScrollView>
                    ) : (
                        this.renderTabBar()
                    )}
                </View>
                <View style={[styles.flex1, tabContentStyle]}>{matchedTabPane}</View>
            </View>
        );
    }
}

const styleMapper = memoizeTheme(themeName =>
    StyleSheet.create({
        flex1: {
            flex: 1,
        },
        flexRow: {
            flexDirection: "row",
        },
        tabBarGradient: {
            alignSelf: "stretch",
        },
        tabBarTextContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        tabBarActiveText: {
            color: ThemeProvider.getTextColor(themeName, "buttonPrimary"),
        },
        tabBarInactiveText: {
            color: ThemeProvider.getTextColor(themeName, "highlightInDark"),
        },
        tabItemBorderHorizontal: {
            height: 1,
        },
        tabItemBorderVertical: {
            width: 1,
        },
    })
);

const sizeRelatedStyles: Record<Size, {height: number; width: number}> = {
    large: {height: 48, width: 80},
    medium: {height: 34, width: 86},
};
