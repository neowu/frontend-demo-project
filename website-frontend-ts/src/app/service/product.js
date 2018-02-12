import api from "../../framework/api";

export function listProducts() {
    return api.get("/ajax/product");
}

export function loadCreateProductConfig() {
    return api.get("/ajax/product/create-config");
}
