import {ListProductResponse, GetProductResponse, CreateProductConfigResponse} from "type/api";
import {ajax} from "core-fe";

class ProductAJAXWebService {
    list(): Promise<ListProductResponse> {
        return ajax("GET", "/ajax/product", {}, null);
    }
    get(id: string): Promise<GetProductResponse> {
        return ajax("GET", "/ajax/product/:id", {id}, null);
    }
    getChild(id: string, childId: string): Promise<GetProductResponse> {
        return ajax("GET", "/ajax/product/:id/child/:childId", {id, childId}, null);
    }
    createConfig(): Promise<CreateProductConfigResponse> {
        return ajax("GET", "/ajax/product/create-config", {}, null);
    }
}
export default new ProductAJAXWebService();
