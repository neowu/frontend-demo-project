import {effect, Listener, LocationChangedEvent, module} from "framework";
import {actions, Actions, namespace, State} from "./type";
import {call, put} from "redux-saga/effects";
import {app} from "type/api";
import productAJAXService from "./ajax/product";
import AddProduct from "./component/AddProduct";
import ProductList from "./component/ProductList";

const initialState: State = {
    createProductUI: {
        types: []
    }
};

class ActionHandler implements Actions {
    @effect()
    * loadCreateProductConfig() {
        const response = yield call(productAJAXService.createConfig);
        yield put(actions.populateCreateProductConfig(response));
    }

    @effect(true)
    * loadProductList() {
        yield call(productAJAXService.list);
    }

    populateCreateProductConfig(response: app.api.product.CreateProductConfigResponse, state: State = initialState): State {
        const types = response.types.map(type => {
            return {name: type.name, value: type.value};
        });
        return {
            ...state,
            createProductUI: {types}
        };
    }
}

class ListenerImpl implements Listener {
    * onLocationChanged(event: LocationChangedEvent) {
        if (event.location.pathname === "/product/add") {
            yield put(actions.loadCreateProductConfig());
        } else if (event.location.pathname === "/product/list") {
            yield put(actions.loadProductList());
        }
    }
}

export default module(namespace, {AddProduct, ProductList}, new ActionHandler(), initialState, new ListenerImpl());
