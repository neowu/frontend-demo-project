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
