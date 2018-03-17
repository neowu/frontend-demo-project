// generated from server side, e.g. https://localhost:8443/_sys/api

export namespace app.api.user {
    export interface CurrentUserAJAXResponse {
        loggedIn?: boolean;
        name?: string;
        role?: string;
    }
    export interface LoginAJAXRequest {
        username: string;
        password: string;
    }
    export interface LoginAJAXResponse {
        success?: boolean;
        name?: string;
        role?: string;
        errorMessage?: string;
    }
}
export namespace app.api {
    export const AccountAJAXWebServiceMetadata = {
        currentUser: {method: "GET", path: "/ajax/currentUser"},
        login: {method: "PUT", path: "/ajax/login"},
        logout: {method: "PUT", path: "/ajax/logout"},
    };
    export interface AccountAJAXWebService {
        currentUser(): Promise<app.api.user.CurrentUserAJAXResponse>;

        login(request: app.api.user.LoginAJAXRequest): Promise<app.api.user.LoginAJAXResponse>;

        logout(): Promise<void>;
    }

    export const ProductAJAXWebServiceMetadata = {
        list: {method: "GET", path: "/ajax/product"},
        createConfig: {method: "GET", path: "/ajax/product/create-config"},
    };
    export interface ProductAJAXWebService {
        list(): Promise<app.api.product.ListProductResponse>;

        createConfig(): Promise<app.api.product.CreateProductConfigResponse>;
    }
}
export namespace app.api.product {
    export interface ListProductResponse {
        name?: string;
    }
    export interface CreateProductConfigResponse {
        types?: app.api.product.CreateProductConfigResponse$ProductType[];
    }
    export interface CreateProductConfigResponse$ProductType {
        name?: string;
        value?: string;
    }
}
