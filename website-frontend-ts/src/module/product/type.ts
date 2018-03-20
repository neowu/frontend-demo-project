import {app} from "type/api";
import {actionCreator, actionType} from "framework";
import CreateProductConfigResponse = app.api.product.CreateProductConfigResponse;

export const namespace = "product";

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

export const actionTypes = actionType<Actions>(namespace);
