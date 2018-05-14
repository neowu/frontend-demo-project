import {app} from "type/api";
import CreateProductConfigResponse = app.api.product.CreateProductConfigResponse;

export const LOADING_PRODUCT_LIST = "product/list";

export interface State {
    createProductUI: {
        types: Array<{
            name: string;
            value: string;
        }>;
        now: Date;
    };
}

export interface Actions {
    populateCreateProductConfig(response: CreateProductConfigResponse);

    loadProductList();

    loadCreateProductConfig();
}
