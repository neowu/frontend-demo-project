import {ListProductResponse, GetProductResponse, CreateProductConfigResponse} from "type/api";
import {ajax} from "core-fe";

export class ProductAJAXWebService {
    static list(): Promise<ListProductResponse> {
        return ajax("GET", "/ajax/product", {}, null);
    }
    static get(id: string): Promise<GetProductResponse> {
        return ajax("GET", "/ajax/product/:id", {id}, null);
    }
    static getChild(id: string, childId: string): Promise<GetProductResponse> {
        return ajax("GET", "/ajax/product/:id/child/:childId", {id, childId}, null);
    }
    static createConfig(): Promise<CreateProductConfigResponse> {
        return ajax("GET", "/ajax/product/create-config", {}, null);
    }
}
