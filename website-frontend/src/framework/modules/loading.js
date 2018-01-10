const reducers = {
    "@@framework/LOADING_SHOW": (state, action) => ({
        ...state,
        [action.actionType]: true
    }),
    "@@framework/LOADING_HIDE": (state, action) => ({
        ...state,
        [action.actionType]: false
    })
};

const module = {
    reducers: reducers,
    effects: [],
    state: {}
};

export default module;
