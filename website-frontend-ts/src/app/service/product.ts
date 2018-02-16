import api from "../../framework/api";

export function listProducts() {
    return (api as any).get("/ajax/product");
}

export function loadCreateProductConfig() {
    return (api as any).get("/ajax/product/create-config");
}
