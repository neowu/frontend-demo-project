import api from "../../framework/api";

export function getCurrentUser() {
    return api.get("/ajax/currentUser");
}

export function login(username, password) {
    const request = {
        username: username,
        password: password
    };
    return api.put("/ajax/login", request);
}

export function logout() {
    return api.put("/ajax/logout");
}
