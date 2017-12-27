import reducers from "./user-reducers";
import effects from "./user-effects";

const state = {
    currentUser: {
        loggedIn: false,
        role: null,
        name: null
    },
    login: {
        success: false,
        error: null
    }
};

const module = {
    state: state,
    reducers: reducers,
    effects: effects
};

export default module;
