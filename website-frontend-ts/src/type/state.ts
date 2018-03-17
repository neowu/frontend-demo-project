import {State as UserState} from "module_v2/user/type";
import {State as ProductState} from "module_v2/product/type";
import {FrameworkState} from "framework_v2";

export interface RootState extends FrameworkState {
    app: {
        user: UserState;
        product: ProductState;
    };
}
