export interface CurrentUserAJAXResponse {
    loggedIn: boolean;
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
export interface ListProductResponse {}
export interface GetProductResponse {}
export interface CreateProductConfigResponse {
    types?: CreateProductConfigResponse$ProductType[];
    now: Date;
}
export interface CreateProductConfigResponse$ProductType {
    name?: string;
    value?: string;
}
