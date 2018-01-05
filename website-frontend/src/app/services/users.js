import api from "../../framework/api";

export function getCurrentUser() {
    return api.get("/ajax/currentUser")
        .then(response => ({
            loggedIn: response.loggedIn,
            role: response.role,
            name: response.name
        }));
}

export function login(request) {
    const ajaxRquest = {
        username: request.username,
        password: request.password
    };
    return api.put("/ajax/login", ajaxRquest)
        .then(response => ({
            success: response.success,
            errorMessage: response.errorMessage,
            name: response.name,
            role: response.role
        }));
}

export function logout() {
    return api.put("/ajax/logout");
}
