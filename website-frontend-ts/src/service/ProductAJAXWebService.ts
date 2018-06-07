import {ListProductResponse, CreateProductConfigResponse} from "type/api";
import {ajax} from "framework/ajax";

class ProductAJAXWebService {
    list(): Promise<ListProductResponse> {
        return ajax("/ajax/product", "GET", null);
    }
    createConfig(): Promise<CreateProductConfigResponse> {
        return ajax("/ajax/product/create-config", "GET", null);
    }
}
export default new ProductAJAXWebService();
