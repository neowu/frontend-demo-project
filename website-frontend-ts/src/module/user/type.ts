export interface State {
    currentUser: {
        loggedIn: boolean;
        role: string | null;
        name: string | null;
    };
    login: {
        success: boolean;
        errorMessage: string | null;
    };
}
