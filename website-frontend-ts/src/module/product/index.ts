import {Listener, module} from "framework_v2";
import {actions, Actions, namespace, State} from "./type";
import {Location} from "history";
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

class ActionHandler implements Actions, Listener {
    populateCreateConfig(response: app.api.product.CreateProductConfigResponse, state: State = initialState): State {
        const types = response.types.map(type => {
            return {name: type.name, value: type.value};
        });
        return {
            ...state,
            createProductUI: {types}
        };
    }

    * _onLocationChanged(location: Location) {
        if (location.pathname === "/product/add") {
            const response = yield call(productAJAXService.createConfig);
            yield put(actions.populateCreateConfig(response));
        } else if (location.pathname === "/product/list") {
            yield call(productAJAXService.list);
        }
    }
}

export default module(namespace, {AddProduct, ProductList}, new ActionHandler(), initialState);
