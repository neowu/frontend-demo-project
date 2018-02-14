import reducers from "./user-reducer";
import effects from "./user-effect";

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
    state,
    reducers,
    effects,
    initialize: (dispatch) => {
        dispatch({type: "CHECK_CURRENT_USER"});
    }
};

export default module;
