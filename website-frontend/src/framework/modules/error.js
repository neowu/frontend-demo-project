const reducers = {
    "@@framework/ERROR": (state, action) => ({
        message: action.message,
        detail: action.detail
    })
};

const module = {
    reducers: reducers,
    effects: [],
    state: {
        message: null,
        detail: null
    }
};

export default module;
