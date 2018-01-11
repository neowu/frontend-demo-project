import axios from "axios";

function wrapError(error) {
    let message = "failed to call API";
    let detail = null;
    if (error.response) {
        message += ", status=" + error.response.status;
        detail = error.response.data;
    }
    return {
        message,
        detail
    };
}

axios.interceptors.response.use(response => response, (error) => {
    throw wrapError(error);
});

export default {
    get: url => axios.get(url)
        .then(response => response.data),

    post: (url, body) => axios.post(url, body)
        .then(response => response.data),

    delete: url => axios.delete(url)
        .then(response => response.data),

    put: (url, body) => axios.put(url, body)
        .then(response => response.data),

    patch: (url, body) => axios.patch(url, body)
        .then(response => response.data)
};


