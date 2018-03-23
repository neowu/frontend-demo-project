import {app} from "type/api";
import {actionCreator} from "framework";
import CreateProductConfigResponse = app.api.product.CreateProductConfigResponse;

export const namespace = "product";
export const LOADING_PRODUCT_LIST = "product/list";

export interface State {
    createProductUI: {
        types: Array<{
            name: string;
            value: string;
        }>;
    };
}

export interface Actions {
    populateCreateProductConfig(response: CreateProductConfigResponse);

    loadProductList();

    loadCreateProductConfig();
}

export const actions = actionCreator<Actions>(namespace);
