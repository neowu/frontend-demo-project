import {call, Interval, Lifecycle, Loading, Module, register, SagaIterator} from "core-fe";
import {Location} from "history";
import {ProductAJAXWebService} from "service/ProductAJAXWebService";
import AddProductComponent from "./component/AddProduct";
import ProductListComponent from "./component/ProductList";
import {LOADING_PRODUCT_LIST, State} from "./type";
import {RootState} from "type/state";

const initialState: State = {
    createProductUI: {
        types: [],
        now: null,
    },
};

class ProductModule extends Module<RootState, "product"> {
    *loadCreateProductConfig(): SagaIterator {
        const response = yield* call(ProductAJAXWebService.createConfig);
        const types = response.types.map(type => {
            return {name: type.name, value: type.value};
        });
        this.setState({
            createProductUI: {types, now: response.now},
        });
    }

    @Loading(LOADING_PRODUCT_LIST)
    *loadProductList(): SagaIterator {
        yield* call(ProductAJAXWebService.list);
    }

    @Lifecycle()
    *onLocationMatched(routeParameters: {}, location: Location): SagaIterator {
        if (location.pathname === "/product/add") {
            yield* this.loadCreateProductConfig();
        } else if (location.pathname === "/product/list") {
            yield* this.loadProductList();
        }
    }

    @Lifecycle()
    @Interval(3)
    *onTick(): SagaIterator {
        // console.log("from product module, print every 3 secs");
    }
}

const module = register(new ProductModule("product", initialState));
export const actions = module.getActions();
export const AddProduct = module.attachLifecycle(AddProductComponent);
export const ProductList = module.attachLifecycle(ProductListComponent);
