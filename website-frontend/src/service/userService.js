import axios from "axios";

export function getCurrentUser() {
    return axios.get("/ajax/loginUser")
        .then(response => ({response: response.data}))
        .catch(error => ({error}));
}
