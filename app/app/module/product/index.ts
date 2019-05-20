import {ProductAJAXWebService} from "app/service/api/ProductAJAXWebService";
import {call, Lifecycle, Loading, Module, register} from "core-native";
import {SagaIterator} from "redux-saga";
import ProductList from "./component/ProductList";
import {LOADING_PRODUCT_LIST, State} from "./type";

const initialState: State = {};

class ProductModule extends Module<State> {
    @Lifecycle()
    *onEnter(): SagaIterator {
        yield* this.loadProductList();
    }

    @Loading(LOADING_PRODUCT_LIST)
    * loadProductList(): SagaIterator {
        yield call(ProductAJAXWebService.list);
    }
}

const module = register(new ProductModule("product", initialState));
export const actions = module.getActions();
export const ProductListComponent = module.attachLifecycle(ProductList);
