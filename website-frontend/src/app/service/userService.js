import axios from "axios";

export function getCurrentUser() {
    return axios.get("/ajax/currentUser")
        .then(response => ({response: response.data}))
        .catch(error => ({error}));
}

export function login(username, password) {
    const request = {
        username: username,
        password: password
    };
    return axios.put("/ajax/login", request)
        .then(response => ({response: response.data}))
        .catch(error => ({error}));
}
