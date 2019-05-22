export interface CurrentUserAJAXResponse {
    loggedIn: boolean;
    name: string | null;
    role: string | null;
}
export interface LoginAJAXRequest {
    username: string;
    password: string;
}
export interface LoginAJAXResponse {
    success: boolean;
    name: string | null;
    role: string | null;
    errorMessage: string | null;
}
export interface ListProductResponse {}
export interface GetProductResponse {}
export interface CreateProductConfigResponse {
    types: CreateProductConfigResponse$ProductType[];
    now: Date;
}
export interface CreateProductConfigResponse$ProductType {
    name: string;
    value: string;
}
export interface AJAXErrorResponse {
    id: string | null;
    errorCode: string | null;
    message: string | null;
}
