export interface State {
    currentUser: {
        loggedIn: boolean;
        role: string;
        name: string;
    };
    login: {
        success: boolean;
        errorMessage: string;
    };
}
