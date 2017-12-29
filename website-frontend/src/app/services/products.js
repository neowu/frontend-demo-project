import api from "../../framework/api";

export function listProducts() {
    return api.get("/ajax/product");
}
