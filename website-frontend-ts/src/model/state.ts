import {State as UserState} from "../module_v2/user/type";
import {State as ProductState} from "../module_v2/product/type";

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
        product: ProductState;
    };
}
