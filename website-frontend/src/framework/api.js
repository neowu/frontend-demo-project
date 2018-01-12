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

const api = {};
["get", "delete", "post", "put", "patch"].forEach((method) => {
    api[method] = (url, data) => axios.request({
        method,
        url,
        data
    }).then(response => response.data);
});

export default api;
