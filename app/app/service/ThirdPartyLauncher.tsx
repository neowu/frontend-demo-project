import {Overlay, OverlayManager} from "app/component/library";
import {globalStyles} from "app/util/globalDefinition";
import React from "react";
import {Linking, Text, View} from "react-native";

function Launcher(props: {visible: boolean; onClose: () => void}) {
    return (
        <Overlay visible={props.visible} style={globalStyles.flex1Center}>
            <View style={globalStyles.launchingURLContainer}>
                <Text>转跳中 ...</Text>
            </View>
        </Overlay>
    );
}

export class ThirdPartyLauncher {
    static open(url: string | null) {
        if (url) {
            // Using pop & delay to make the effect looks smooth
            // In some case (first time), Linking.openURL may lag, to suspend the whole UI
            const handler = OverlayManager.push(Launcher, {});
            setTimeout(() => Linking.openURL(url), 500);
            setTimeout(handler.destroy, 3000);
        }
    }
}
