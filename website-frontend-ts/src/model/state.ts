import {State as UserState} from "../module_v2/user/type";

export interface RootState {
    router: {
        location: {
            pathname: string;
            search: {};
            hash: string;
            key: string;
        };
    };
    app: {
        user: UserState;
    };
}
