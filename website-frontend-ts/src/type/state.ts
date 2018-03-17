import {State as UserState} from "module/user/type";
import {State as ProductState} from "module/product/type";
import {FrameworkState} from "framework_v2";

export interface RootState extends FrameworkState {
    app: {
        user: UserState;
        product: ProductState;
    };
}
