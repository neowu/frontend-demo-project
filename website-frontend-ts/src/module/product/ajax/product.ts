import {ajax} from "framework/ajax";
import {app} from "../../../type/api";
import ProductAJAXWebServiceMetadata = app.api.ProductAJAXWebServiceMetadata;
import ProductAJAXWebService = app.api.ProductAJAXWebService;

class ProductAJAXWebServiceImpl implements ProductAJAXWebService {
    list(): Promise<app.api.product.ListProductResponse> {
        const meta = ProductAJAXWebServiceMetadata.list;
        return ajax(meta.path, meta.method, {});
    }

    createConfig(): Promise<app.api.product.CreateProductConfigResponse> {
        const meta = ProductAJAXWebServiceMetadata.createConfig;
        return ajax(meta.path, meta.method, {});
    }
}

export default new ProductAJAXWebServiceImpl();
