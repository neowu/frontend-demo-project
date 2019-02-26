import {call, Loading, register, Interval, Module, Lifecycle} from "core-fe";
import {Location} from "history";
import {SagaIterator} from "redux-saga";
import {ProductAJAXWebService} from "service/ProductAJAXWebService";
import AddProductComponent from "./component/AddProduct";
import ProductListComponent from "./component/ProductList";
import {LOADING_PRODUCT_LIST, State} from "./type";

const initialState: State = {
    createProductUI: {
        types: [],
        now: null,
    },
};

class ProductModule extends Module<State> {
    *loadCreateProductConfig() {
        const effect = call(ProductAJAXWebService.createConfig);
        yield effect;
        const response = effect.result();
        const types = response.types.map(type => {
            return {name: type.name, value: type.value};
        });
        yield* this.setState({
            createProductUI: {types, now: response.now},
        });
    }

    @Loading(LOADING_PRODUCT_LIST)
    *loadProductList(): SagaIterator {
        yield call(ProductAJAXWebService.list);
    }

    @Lifecycle()
    *onEnter(location: Location): SagaIterator {
        if (location.pathname === "/product/add") {
            yield* this.loadCreateProductConfig();
        } else if (location.pathname === "/product/list") {
            yield* this.loadProductList();
        }
    }

    @Interval(3)
    *onTick(): SagaIterator {
        // console.log("from product module, print every 3 secs");
    }
}

const module = register(new ProductModule("product", initialState));
export const actions = module.getActions();
export const AddProduct = module.attachLifecycle(AddProductComponent);
export const ProductList = module.attachLifecycle(ProductListComponent);
