import effects from "./product-effects";

const state = {};

const module = {
    state: state,
    reducers: {},
    effects: effects,
    subscription: (history, dispatch) => {
        history.listen(({pathname}) => {
            if (pathname === "/product") {
                dispatch({type: "PRODUCT/LIST"});
            }
        });
    }
};

export default module;
