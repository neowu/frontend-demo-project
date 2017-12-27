const reducers = {
    "ERROR": (state, action) => ({
        hasError: true,
        message: action.error
    })
};

const module = {
    reducers: reducers,
    effects: [],
    state: {
        hasError: false,
        message: null
    }
};

export default module;
