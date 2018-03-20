import {app} from "../../type/api";
import {actionCreator} from "../../framework/actionCreator";
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
    populateCreateConfig(response: CreateProductConfigResponse);
}

export const actions = actionCreator<Actions>(namespace);
