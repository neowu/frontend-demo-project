import {ajax} from "framework/ajax";
import {app} from "./api";
import ProductAJAXWebServiceMeta = app.api.ProductAJAXWebServiceMeta;
import ProductAJAXWebService = app.api.ProductAJAXWebService;

class ProductAJAXWebServiceImpl implements ProductAJAXWebService {
    public list(): Promise<app.api.product.ListProductResponse> {
        return ajax(ProductAJAXWebServiceMeta.list.path, ProductAJAXWebServiceMeta.list.method, {});
    }

    public createConfig(): Promise<app.api.product.CreateProductConfigResponse> {
        return ajax(ProductAJAXWebServiceMeta.createConfig.path, ProductAJAXWebServiceMeta.createConfig.method, {});
    }
}

export default new ProductAJAXWebServiceImpl();
