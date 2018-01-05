import reducers from "./product-reducers";
import effects from "./product-effects";

const state = {
    createProductUI: {
        types: []
    }
};

const module = {
    state: state,
    reducers: reducers,
    effects: effects,
    subscription: (history, dispatch) => {
        const listener = ({pathname}) => {
            if (pathname === "/product/list") {
                dispatch({type: "PRODUCT/LIST"});
            } else if (pathname === "/product/add") {
                dispatch({type: "PRODUCT/LOAD_CREATE_CONFIG"});
            }
        };
        history.listen(listener);
        listener(history.location);
    }
};

export default module;
