import {actionCreator, effect, Listener, loading, LocationChangedEvent, register} from "framework";
import {call, put} from "redux-saga/effects";
import {app} from "type/api";
import productAJAXService from "./ajax/product";
import AddProduct from "./component/AddProduct";
import ProductList from "./component/ProductList";
import {Actions, LOADING_PRODUCT_LIST, State} from "./type";

const initialState: State = {
    createProductUI: {
        types: [],
        now: null,
    },
};

class ActionHandler implements Actions {
    @effect
    *loadCreateProductConfig() {
        const response = yield call(productAJAXService.createConfig);
        yield put(actions.populateCreateProductConfig(response));
    }

    @effect
    @loading(LOADING_PRODUCT_LIST)
    *loadProductList() {
        yield call(productAJAXService.list);
    }

    populateCreateProductConfig(response: app.api.product.CreateProductConfigResponse, state: State = initialState): State {
        const types = response.types.map(type => {
            return {name: type.name, value: type.value};
        });
        return {
            ...state,
            createProductUI: {types, now: response.now},
        };
    }
}

class ListenerImpl implements Listener {
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

const namespace = "product";
const actions = actionCreator<Actions>(namespace, ActionHandler.prototype); // specify <Actions> type, so all type definition will go to interface
const handler = new ActionHandler();
const listener = new ListenerImpl();
register({namespace, handler, initialState, listener});
export {actions, AddProduct, ProductList};
