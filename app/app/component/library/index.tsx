import {Omit} from "app/type/definition";
import React from "react";
import AddMinusButton from "./src/AddMinusButton";
import Badge from "./src/Badge";
import Button, {Color as ButtonColor} from "./src/Button";
import Checkbox from "./src/Checkbox";
import FormRow from "./src/FormRow";
import Icon, {IconClass} from "./src/Icon";
import Input from "./src/Input";
import Line from "./src/Line";
import NumberInput from "./src/NumberInput";
import InternalOverlayManager, {ActionModalConfig, ActionModalPromisedConfig, DrawerConfig, ModalConfig} from "./src/overlay/InternalOverlayManager";
import Overlay from "./src/overlay/Overlay";
import RootView from "./src/RootView";
import Select from "./src/select/Select";
import Spin from "./src/Spin";
import Switch from "./src/Switch";
import Tabs from "./src/tab/Tabs";
import Table, {ColumnProps, Props as TableProps, TableRowSelection} from "./src/table/Table";
import Text, {Props as TextProps, Color as TextColor} from "./src/Text";
import {memoizeTheme, ThemeContext, ThemeContextType} from "./src/theme";
import Touchable from "./src/Touchable";

class OverlayManager {
    static pushModal(children: React.ReactNode, config: ModalConfig = {title: ""}) {
        return InternalOverlayManager.getInstance().pushModal(children, config);
    }

    static pushModalAsPromise(children: React.ReactNode, config: ModalConfig = {title: ""}) {
        return InternalOverlayManager.getInstance().pushModalAsPromise(children, config);
    }

    static pushActionModal(config: Omit<ActionModalConfig, "onCancel" | "onOk">) {
        return InternalOverlayManager.getInstance().pushActionModal({...config, onCancel: OverlayManager.pop, onOk: OverlayManager.pop});
    }

    static pushActionModalAsPromise(config: ActionModalPromisedConfig) {
        return InternalOverlayManager.getInstance().pushActionModalAsPromise(config);
    }

    static pushDrawer(children: React.ReactNode, config: DrawerConfig = {}) {
        return InternalOverlayManager.getInstance().pushDrawer(children, config);
    }

    static push<P extends {onClose: () => void; visible: boolean}>(componentType: React.ComponentType<P>, config: Omit<P, "onClose" | "visible">, children: React.ReactNode = null) {
        return InternalOverlayManager.getInstance().push(componentType, config, children);
    }

    static pop() {
        return InternalOverlayManager.getInstance().destroyLastItem();
    }

    static confirm(text: React.ReactNode) {
        return InternalOverlayManager.getInstance().pushConfirmationAsPromise(text);
    }

    static toast(content: React.ReactNode) {
        // content must be text-based
        return InternalOverlayManager.getInstance().createToast(content);
    }
}

// Export components
export {Checkbox, Switch, Badge, Button, Icon, IconClass, AddMinusButton, Table, NumberInput, Input, RootView, Tabs, Text, Select, Spin, Overlay, Touchable, FormRow, Line};

// Export static UI utility
export {OverlayManager};

// Export theme-related
export {ThemeContext, ThemeContextType, memoizeTheme};

// Export types & interfaces
export {ColumnProps, TableRowSelection, TableProps, TextProps, ButtonColor, TextColor};
