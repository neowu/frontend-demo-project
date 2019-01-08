export const LOADING_PRODUCT_LIST = "product/list";

export interface State {
    createProductUI: {
        types: Array<{
            name: string;
            value: string;
        }>;
        now: Date | null;
    };
}
