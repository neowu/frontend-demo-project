import reducers from "./product-reducer";
import effects from "./product-effect";

const state = {
    createProductUI: {
        types: []
    }
};

const module = {
    state: state,
    reducers: reducers,
    effects: effects,
    listener: dispatch => ({pathname}) => {
        if (pathname === "/product/list") {
            dispatch({type: "PRODUCT/LIST"});
        } else if (pathname === "/product/add") {
            dispatch({type: "PRODUCT/LOAD_CREATE_CONFIG"});
        }
    }
};

export default module;
