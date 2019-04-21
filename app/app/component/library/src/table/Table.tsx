import {ThemeProvider} from "app/theme/ThemeProvider";
import {PickOptional} from "app/type/definition";
import React from "react";
import {FlatList, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Checkbox from "../Checkbox";
import Icon, {IconClass} from "../Icon";
import Spin from "../Spin";
import ColoredText from "../Text";
import {memoizeTheme, ThemeContext} from "../theme";
import Touchable from "../Touchable";
import Cell from "./Cell";

export type Size = "small" | "large";
export type Align = "left" | "right" | "center";
export type WidthStyle = {fixed: number} | {flex: number};

export interface ColumnProps<T> {
    title?: string | React.ReactElement;
    render: (record: T, index: number) => string | React.ReactElement;
    width?: WidthStyle;
    titleAlign?: Align;
    contentAlign?: Align;
    wrapWithTextNode?: boolean;
}

export interface TableRowSelection<T> {
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[]) => void;
    isDisabled?: (record: T) => boolean;
}

export interface Props<T> {
    dataSource: T[];
    columns: Array<ColumnProps<T>>;
    rowKey?: ((record: T, index: number) => string) | (keyof T & string);
    showHeader?: boolean;
    isRefreshing?: boolean;
    size?: Size;
    allowRowMultiline?: boolean;
    onRowPress?: (record: T, index: number) => void; // An ending arrow will show if onRowPress is set
    emptyPlaceholder?: React.ReactElement | string;
    rowSelection?: TableRowSelection<T>;
    pageIndex?: number; // Required if onPullUpLoading is set
    totalPage?: number; // Required if onPullUpLoading is set
    onPullUpLoading?: (pageIndex: number) => void;
    onPullDownRefresh?: () => void;
    onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
    style?: StyleProp<ViewStyle>;
}

interface State {
    disabledStatus: boolean[];
}

export default class Table<T> extends React.PureComponent<Props<T>, State> {
    public context!: React.ContextType<typeof ThemeContext>;
    public static contextType = ThemeContext;
    public static defaultProps: PickOptional<Props<any>> = {
        rowKey: (_, index) => index.toString(),
        showHeader: true,
        isRefreshing: false,
        size: "large",
        allowRowMultiline: false,
        emptyPlaceholder: "",
    };

    private readonly rowSelectionColumnWidth: WidthStyle = {fixed: 30};
    private readonly endingArrowColumn: ColumnProps<T> = {title: "", width: {fixed: 26}, render: () => <Icon type={IconClass.ARROW_RIGHT} color="weak" />};
    private readonly listRef: React.RefObject<FlatList<T>>;
    private loadingIndicatorInFooter = true;

    constructor(props: Props<T>) {
        super(props);
        this.listRef = React.createRef();
        this.state = {disabledStatus: []};
    }

    componentDidMount() {
        this.updateDisabledStatus(this.state);
    }

    componentDidUpdate(preProps: Props<T>, prevState: State) {
        this.updateDisabledStatus(prevState);
    }

    getRowKey = (record: T, index: number) => (typeof this.props.rowKey === "function" ? this.props.rowKey(record, index) : record[this.props.rowKey!].toString());

    scrollToBottom = () => this.listRef.current!.scrollToEnd({animated: true});

    isCheckedAll = () => {
        const {rowSelection, dataSource} = this.props;
        if (rowSelection) {
            const keys = dataSource.filter(item => (rowSelection.isDisabled ? !rowSelection.isDisabled(item) : true)).map(this.getRowKey);
            return keys.length !== 0 && keys.every(item => rowSelection.selectedRowKeys.includes(item));
        }
        return false;
    };

    toggleCheckAll = () => {
        const {rowSelection, dataSource} = this.props;
        if (rowSelection) {
            const existDisabledKeys = dataSource
                .filter(item => (rowSelection.isDisabled ? rowSelection.isDisabled(item) : false))
                .map(this.getRowKey)
                .filter(item => rowSelection.selectedRowKeys.includes(item));
            const keys = dataSource.filter(item => (rowSelection.isDisabled ? !rowSelection.isDisabled(item) : true)).map(this.getRowKey);
            if (keys.every(item => rowSelection.selectedRowKeys.includes(item))) {
                rowSelection.onChange(existDisabledKeys);
            } else {
                rowSelection.onChange(keys.concat(existDisabledKeys));
            }
        }
    };

    updateDisabledStatus = (state: State) => {
        const {dataSource, rowSelection} = this.props;
        const disabledStatus = dataSource.map(_ => (rowSelection && rowSelection.isDisabled ? rowSelection.isDisabled(_) : false));
        if (state.disabledStatus.toString() !== disabledStatus.toString()) {
            this.setState({disabledStatus});
        }
    };

    getItemLayout = (data: T[] | null, index: number) => {
        const rowHeight = this.props.size === "large" ? largeRowHeight : smallRowHeight;
        return {length: rowHeight, offset: rowHeight * index, index};
    };

    /**
     * Do not push checkbox (rowSelection) into columns, because the title (check-all) is subject to change
     */
    getColumns = () => (this.props.onRowPress ? this.props.columns.concat(this.endingArrowColumn) : this.props.columns);

    onEndReached = () => {
        const {pageIndex, totalPage, onPullUpLoading} = this.props;
        if (pageIndex && totalPage && pageIndex < totalPage && onPullUpLoading) {
            this.loadingIndicatorInFooter = true;
            onPullUpLoading(pageIndex + 1);
        }
    };

    onRefresh = () => {
        const {onPullDownRefresh} = this.props;
        if (onPullDownRefresh) {
            this.loadingIndicatorInFooter = false;
            onPullDownRefresh();
        }
    };

    renderFooter = () => {
        const {themeName} = this.context;
        const styles = styleMapper(themeName);
        const loadingComponent = (
            <View style={styles.footerContainer}>
                <Spin />
                <ColoredText>loading</ColoredText>
            </View>
        );
        const {emptyPlaceholder, dataSource, isRefreshing} = this.props;
        if (dataSource.length === 0) {
            if (isRefreshing) {
                // Initial loading
                return loadingComponent;
            }

            return typeof emptyPlaceholder === "string" ? (
                <View style={styleMapper(this.context.themeName).placeholderContainer}>
                    <Icon color="weak" type={IconClass.NONE} style={styles.emptyIcon} />
                    <ColoredText size="small" color="weak">
                        {emptyPlaceholder}
                    </ColoredText>
                </View>
            ) : (
                emptyPlaceholder!
            );
        }

        return this.loadingIndicatorInFooter && isRefreshing ? loadingComponent : null;
    };

    renderCheckbox = ({item, index}: {item: T; index: number}) => {
        const {rowSelection} = this.props;
        const {disabledStatus} = this.state;
        if (rowSelection) {
            const onToggleCheckbox = () => {
                const keys = [...rowSelection.selectedRowKeys];
                const rowKey = this.getRowKey(item, index);
                const existedKeyIndex = keys.indexOf(rowKey);
                if (existedKeyIndex !== -1) {
                    keys.splice(existedKeyIndex, 1);
                    rowSelection.onChange(keys);
                } else {
                    keys.push(rowKey);
                    rowSelection.onChange(keys);
                }
            };
            const checkboxNode = <Checkbox checked={rowSelection.selectedRowKeys.indexOf(this.getRowKey(item, index)) > -1} disabled={disabledStatus[index]} onChange={onToggleCheckbox} />;
            return <Cell content={checkboxNode} width={this.rowSelectionColumnWidth} />;
        }
    };

    renderRow = ({item, index}: ListRenderItemInfo<T>) => {
        const {size, onRowPress, allowRowMultiline} = this.props;
        const {themeName} = this.context;
        const styles = styleMapper(themeName);
        const sizeStyle = {height: allowRowMultiline ? undefined : size === "large" ? largeRowHeight : smallRowHeight};
        const allowRowMultilineStyle = {paddingVertical: !allowRowMultiline ? undefined : size === "large" ? allowRowMultilineLargePaddingVertical : allowRowMultilineSmallPaddingVertical};
        return (
            <Touchable enableHitSlop={false} activeOpacity={onRowPress ? undefined : 1} onPress={() => onRowPress && onRowPress(item, index)} style={[styles.bodyRow, index % 2 !== 0 && styles.bodyRowEven, sizeStyle, allowRowMultilineStyle]}>
                {this.renderCheckbox({item, index})}
                {this.getColumns().map((column, columnIndex) => (
                    <Cell key={columnIndex} mode={allowRowMultiline ? "multiline-content" : "content"} content={column.render(item, index)} align={column.contentAlign} width={column.width} />
                ))}
            </Touchable>
        );
    };

    render() {
        const {showHeader, isRefreshing, rowSelection, dataSource, onPullDownRefresh, onScroll, allowRowMultiline, style} = this.props;
        const {themeName} = this.context;
        const styles = styleMapper(themeName);
        const tableHeaderProps = ThemeProvider.getGradientProps(themeName, "tableHeader");
        return (
            <View style={[styles.container, style]}>
                {showHeader && (
                    <View style={styles.headerRowContainer}>
                        <LinearGradient {...tableHeaderProps} style={styles.headerRow}>
                            {rowSelection && <Cell content={<Checkbox checked={this.isCheckedAll()} onChange={this.toggleCheckAll} />} width={this.rowSelectionColumnWidth} />}
                            {this.getColumns().map((_, index) => (
                                <Cell mode="title" content={_.title} key={index} align={_.titleAlign} width={_.width} />
                            ))}
                        </LinearGradient>
                    </View>
                )}
                <FlatList
                    ref={this.listRef}
                    onScroll={onScroll}
                    onEndReachedThreshold={0.2}
                    onEndReached={this.onEndReached}
                    data={dataSource}
                    renderItem={this.renderRow}
                    ListFooterComponent={this.renderFooter}
                    keyExtractor={this.getRowKey}
                    style={styles.bodyList}
                    extraData={isRefreshing}
                    getItemLayout={allowRowMultiline ? undefined : this.getItemLayout}
                    refreshControl={onPullDownRefresh && <RefreshControl refreshing={!this.loadingIndicatorInFooter && isRefreshing!} onRefresh={this.onRefresh} />}
                />
            </View>
        );
    }
}

const largeRowHeight = 38;
const smallRowHeight = 30;
const allowRowMultilineLargePaddingVertical = 10;
const allowRowMultilineSmallPaddingVertical = 6;
const styleMapper = memoizeTheme(themeName =>
    StyleSheet.create({
        container: {
            flex: 1,
            overflow: "hidden",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: ThemeProvider.getBorderColor(themeName, "line"),
        },
        placeholderContainer: {
            paddingTop: 20,
            justifyContent: "center",
            alignItems: "center",
        },
        headerRowContainer: {
            height: 24,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: ThemeProvider.getBorderColor(themeName, "line"),
        },
        headerRow: {
            flex: 1,
            flexDirection: "row",
            flexWrap: "nowrap",
        },
        bodyList: {
            flex: 1,
        },
        bodyRow: {
            flexDirection: "row",
            flexWrap: "nowrap",
            backgroundColor: ThemeProvider.getBackgroundColor(themeName, "tableOddRow"),
        },
        bodyRowEven: {
            backgroundColor: ThemeProvider.getBackgroundColor(themeName, "tableEvenRow"),
        },
        footerContainer: {
            height: 40,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
        emptyIcon: {
            marginBottom: 5,
            fontSize: 40,
        },
    })
);
