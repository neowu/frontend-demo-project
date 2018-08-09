import {Listener, loading, LocationChangedEvent, register, call, Handler, actionCreator} from "core-fe";
import {put} from "redux-saga/effects";
import {ProductAJAXWebService} from "service/ProductAJAXWebService";
import AddProduct from "./component/AddProduct";
import ProductList from "./component/ProductList";
import {LOADING_PRODUCT_LIST, State} from "./type";
import {SagaIterator} from "redux-saga";

const initialState: State = {
    createProductUI: {
        types: [],
        now: null,
    },
};

class ActionHandler extends Handler<State> implements Listener {
    *loadCreateProductConfig(): SagaIterator {
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

    @loading(LOADING_PRODUCT_LIST)
    *loadProductList(): SagaIterator {
        yield call(ProductAJAXWebService.list);
    }

    *onLocationChanged(event: LocationChangedEvent) {
        if (event.location.pathname === "/product/add") {
            yield put(actions.loadCreateProductConfig());
        } else if (event.location.pathname === "/product/list") {
            yield put(actions.loadProductList());
        }
    }

    // @interval(3)
    // * onTick() {
    //     console.log("from product module, print every 3 secs");
    // }
}

const handler = new ActionHandler("product", initialState);
const actions = actionCreator(handler);
register(handler);
export {actions, AddProduct, ProductList};
