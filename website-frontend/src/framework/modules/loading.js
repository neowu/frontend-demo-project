const reducers = {
    "LOADING/SHOW": (state, action) => ({
        ...state,
        [action.actionType]: true
    }),
    "LOADING/HIDE": (state, action) => ({
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
