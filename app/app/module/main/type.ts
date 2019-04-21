export interface State {
    currentUser: CurrentUser;
}

export interface CurrentUser {
    loggedIn: boolean;
    role?: string | null;
    name?: string | null;
}
