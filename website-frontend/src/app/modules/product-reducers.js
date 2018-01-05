function loadCreateConfig(state, action) {
    return {
        ...state,
        createProductUI: {
            types: action.response.types
        }
    };
}

const reducers = {
    "PRODUCT/CREATE_CONFIG": loadCreateConfig
};

export default reducers;
