import axios from "axios";

export function APIException(message, responseStatus, errorCode): void {
    this.message = message;
    this.stack = Error().stack;
    this.responseStatus = responseStatus;
    this.errorCode = errorCode;
    return this;
}

function handleError(error) {
    let message = "failed to call API";
    let responseStatus = null;
    let errorCode = null;
    if (error.response) {
        responseStatus = error.response.status;
        if (error.response.data) {
            if (error.response.data.message) {
                message = error.response.data.message;
            }
            if (error.response.data.errorCode) {
                errorCode = error.response.data.errorCode;
            }
        }
    }
    throw new APIException(message, responseStatus, errorCode);
}

axios.interceptors.response.use((response) => response, (error) => {
    handleError(error);
});

const api = {};
["get", "delete", "post", "put", "patch"].forEach((method) => {
    api[method] = (url, data) => axios.request({
        method,
        url,
        data
    }).then((response) => response.data);
});

export default api;
