import {State} from "core-fe";
import {State as ProductState} from "module/product/type";
import {State as UserState} from "module/user/type";

export interface RootState extends State {
    app: {
        user: UserState;
        product: ProductState;
    };
}
