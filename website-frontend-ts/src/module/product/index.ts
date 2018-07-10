import {actionCreator, effect, Listener, loading, LocationChangedEvent, register, callAJAX} from "core-fe";
import {put} from "redux-saga/effects";
import productAJAXService from "service/ProductAJAXWebService";
import {CreateProductConfigResponse} from "type/api";
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
        const effect = callAJAX(productAJAXService.createConfig);
        yield effect;
        const response = effect.response();
        yield put(actions.populateCreateProductConfig(response));
    }

    @effect
    @loading(LOADING_PRODUCT_LIST)
    *loadProductList() {
        yield callAJAX(productAJAXService.list);
    }

    populateCreateProductConfig(response: CreateProductConfigResponse, state: State = initialState): State {
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
const handler = new ActionHandler();
const actions = actionCreator<Actions>(namespace, handler); // specify <Actions> type, so all type definition will go to interface
const listener = new ListenerImpl();
register({namespace, handler, initialState, listener});
export {actions, AddProduct, ProductList};
