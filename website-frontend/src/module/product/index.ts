import {call, Interval, Loading, Module, register, SagaGenerator} from "core-fe";
import {Location} from "history";
import {ProductAJAXWebService} from "service/ProductAJAXWebService";
import {RootState} from "type/state";
import AddProductComponent from "./component/AddProduct";
import ProductListComponent from "./component/ProductList";
import {LOADING_PRODUCT_LIST, State} from "./type";

const initialState: State = {
    createProductUI: {
        types: [],
        now: null,
    },
};

class ProductModule extends Module<RootState, "product"> {
    *loadCreateProductConfig(): SagaGenerator {
        const response = yield* call(ProductAJAXWebService.createConfig);
        const types = response.types.map(type => {
            return {name: type.name, value: type.value};
        });
        this.setState({
            createProductUI: {types, now: response.now},
        });
    }

    @Loading(LOADING_PRODUCT_LIST)
    *loadProductList(): SagaGenerator {
        yield* call(ProductAJAXWebService.list);
    }

    override *onLocationMatched(routeParam: {}, location: Location): SagaGenerator {
        if (location.pathname === "/product/add") {
            yield* this.loadCreateProductConfig();
        } else if (location.pathname === "/product/list") {
            yield* this.loadProductList();
        }
    }

    @Interval(3)
    override *onTick(): SagaGenerator {
        // console.log("from product module, print every 3 secs");
    }
}

const module = register(new ProductModule("product", initialState));
export const actions = module.getActions();
export const AddProduct = module.attachLifecycle(AddProductComponent);
export const ProductList = module.attachLifecycle(ProductListComponent);
