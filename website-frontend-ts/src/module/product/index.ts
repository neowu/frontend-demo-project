import {Listener, loading, LocationChangedEvent, register, callAJAX, Handler, actionCreator, effect} from "core-fe";
import {put} from "redux-saga/effects";
import {ProductAJAXWebService} from "service/ProductAJAXWebService";
import {CreateProductConfigResponse} from "type/api";
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
    @effect
    *loadCreateProductConfig(): SagaIterator {
        const effect = callAJAX(ProductAJAXWebService.createConfig);
        yield effect;
        const response = effect.response();
        yield put(actions.populateCreateProductConfig(response));
    }

    @effect
    @loading(LOADING_PRODUCT_LIST)
    *loadProductList(): SagaIterator {
        yield callAJAX(ProductAJAXWebService.list);
    }

    populateCreateProductConfig(response: CreateProductConfigResponse): State {
        const types = response.types.map(type => {
            return {name: type.name, value: type.value};
        });
        return {
            ...this.state,
            createProductUI: {types, now: response.now},
        };
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
