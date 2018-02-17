import api from "../framework/api";

export function getCurrentUser() {
    return (api as any).get("/ajax/currentUser")
        .then((response: any) => ({
            loggedIn: response.loggedIn,
            role: response.role,
            name: response.name
        }));
}

export function login(request: any) {
    const ajaxRequest = {
        username: request.username,
        password: request.password
    };
    return (api as any).put("/ajax/login", ajaxRequest)
        .then((response: any) => ({
            success: response.success,
            errorMessage: response.errorMessage,
            name: response.name,
            role: response.role
        }));
}

export function logout() {
    return (api as any).put("/ajax/logout");
}
