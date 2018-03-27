import {LOCATION_CHANGE} from "connected-react-router";
import {Action as HistoryAction, Location} from "history";

export interface Listener {
    onInitialized?();

    onLocationChanged?(event: LocationChangedEvent);

    onError?(error: any);        // TODO: formalize error type
}

export interface LocationChangedEvent {
    location: Location;
    action: HistoryAction;
}

export const LocationChangedActionType: string = LOCATION_CHANGE;
