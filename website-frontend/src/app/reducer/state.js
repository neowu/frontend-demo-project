const state = {
    currentUser: {
        loggedIn: false,
        role: null,
        name: null
    },
    error: {
        hasError: false
    },
    login: {
        success: false,
        error: null
    }
};

export default state;
