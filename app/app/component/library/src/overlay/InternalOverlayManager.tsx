import {Omit} from "app/type/definition";
import {uuid} from "app/util/default";
import React from "react";
import ActionModal, {Props as ActionModalProps} from "./ActionModal";
import Drawer, {Props as DrawerProps} from "./Drawer";
import Modal, {Props as ModalProps} from "./Modal";
import Toast from "./Toast";

export type ModalConfig = Omit<ModalProps, "onClose" | "visible">;
export type DrawerConfig = Omit<DrawerProps, "onClose" | "visible">;
export type ActionModalConfig = Omit<ActionModalProps, "visible">;
export type ActionModalPromisedConfig = Omit<ActionModalProps, "visible" | "onCancel" | "onOk">;
export type ActionModalUserBehavior = "ok" | "cancel";

interface OverlayBasedComponent {
    CustomComponentType: React.ComponentType<any>;
    props: {onClose: () => void; visible: boolean};
}

interface OverlayBasedComponentMap {
    [key: string]: OverlayBasedComponent;
}

interface OverlayBasedComponentReturnHandler {
    destroy: () => void;
}

interface Props {}

interface State {
    list: OverlayBasedComponentMap;
    toastContent: React.ReactNode;
}

let singletonInstance: InternalOverlayManager | null = null;

// This component must be mounted in RootView
class InternalOverlayManager extends React.PureComponent<Props, State> {
    public static getInstance = () => {
        if (singletonInstance === null) {
            throw Error("RootView has not been mounted");
        }
        return singletonInstance;
    };

    private toastTimer: NodeJS.Timer | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            list: {},
            toastContent: null,
        };
    }

    componentDidMount() {
        singletonInstance = this;
    }

    componentWillUnmount() {
        singletonInstance = null;
        clearTimeout(this.toastTimer!);
    }

    pushActionModal = (config: ActionModalConfig) => {
        const a = InternalOverlayManager.getInstance().destroyLastItem;
        this.push(ActionModal, config);
    };

    pushModal = (children: React.ReactNode, config: ModalConfig) => this.push(Modal, config, children);

    pushDrawer = (children: React.ReactNode, config: DrawerConfig) => this.push(Drawer, config, children);

    // for Modal and Drawer
    push<P extends {visible: boolean; onClose: () => void}>(componentType: React.ComponentType<P>, config: Omit<P, "visible" | "onClose">, children?: React.ReactNode): OverlayBasedComponentReturnHandler;
    // for ActionModal
    push<P extends {visible: boolean; onOk: () => void; onCancel: () => void}>(componentType: React.ComponentType<P>, config: Omit<P, "visible" | "onOk" | "onCancel">, children?: React.ReactNode): OverlayBasedComponentReturnHandler;
    push<P extends {visible: boolean; onClose: () => void; onOk?: () => void; onCancel?: () => void}>(componentType: React.ComponentType<P>, config: P, children?: React.ReactNode) {
        return this.createOverlayBasedComponent(onClose => {
            const props = {
                ...config,
                visible: true,
                children,
            };
            if (!config.onOk) {
                props.onClose = onClose;
            }
            return {CustomComponentType: componentType, props};
        });
    }

    pushModalAsPromise = (children: React.ReactNode, config: ModalConfig): Promise<void> => {
        return new Promise<void>(resolve => {
            this.createOverlayBasedComponent(onClose => ({
                CustomComponentType: Modal,
                props: {
                    ...config,
                    visible: true,
                    onClose: () => {
                        onClose();
                        resolve();
                    },
                    children,
                },
            }));
        });
    };

    pushActionModalAsPromise = (config: ActionModalPromisedConfig): Promise<ActionModalUserBehavior> => {
        return new Promise<ActionModalUserBehavior>(resolve => {
            this.pushActionModal({
                ...config,
                onOk: () => resolve("ok"),
                onCancel: () => resolve("cancel"),
            });
        });
    };

    pushConfirmationAsPromise = (text: React.ReactNode): Promise<ActionModalUserBehavior> => {
        return this.pushActionModalAsPromise({
            body: text,
            okText: "ok",
            cancelText: "cancel",
        });
    };

    destroyLastItem = () => {
        const listItems = Object.entries(this.state.list);
        listItems.reverse();
        const matchedItem = listItems.find(_ => _[1].props.visible);
        if (matchedItem) {
            this.destroyByUUID(matchedItem[0]);
        }
    };

    createToast = (content: React.ReactNode) => {
        clearTimeout(this.toastTimer!);
        this.setState({toastContent: content});
        this.toastTimer = setTimeout(() => this.setState({toastContent: null}), 2000);
    };

    private createOverlayBasedComponent = (componentWrapper: (onClose: () => void) => OverlayBasedComponent): OverlayBasedComponentReturnHandler => {
        // Purge the component list, keep visible only
        const list: OverlayBasedComponentMap = {};
        Object.entries(this.state.list).forEach(([key, data]) => {
            if (data.props.visible) {
                list[key] = data;
            }
        });

        // Encapsulate the props
        const componentUUID = uuid();
        const destroy = () => this.destroyByUUID(componentUUID);
        list[componentUUID] = componentWrapper(destroy);
        this.setState({list});
        return {destroy};
    };

    private destroyByUUID = (componentUUID: string) => {
        if (this.state.list[componentUUID]) {
            this.setState(prevState => {
                // Use callback to get precise state, in case dismissal & creation are happening together
                const list = {...prevState.list};
                list[componentUUID].props = {...list[componentUUID].props, visible: false};
                return {list};
            });
        }
    };

    render() {
        const {list, toastContent} = this.state;
        return (
            <React.Fragment>
                {Object.entries(list).map(([key, {props, CustomComponentType}]) => (
                    <CustomComponentType key={key} {...props} />
                ))}
                <Toast>{toastContent}</Toast>
            </React.Fragment>
        );
    }
}

export default InternalOverlayManager;
