import {Device} from "app/service/Device";
import {ajax, setRequestInterceptor, setResponseInterceptor} from "core-native";
import packageConfig from "../../package.json";

export class NetworkService {
    private static readonly config = {
        apiURL: "",
        sessionId: "",
    };

    static getHTTPHeaders() {
        const headers = {
            Version: packageConfig.version,
            DeviceOS: Device.os(),
            DeviceId: Device.id(),
        };
        const sessionId = NetworkService.config.sessionId;
        return sessionId ? {...headers, SessionId: sessionId} : headers;
    }

    static async init(apiURL: string) {
        NetworkService.config.apiURL = apiURL;
        setRequestInterceptor(request => {
            request.headers = {...request.headers, ...NetworkService.getHTTPHeaders()};
        });
        setResponseInterceptor(async response => {
            const responseSessionId = response.headers.get("SessionId");
            if (responseSessionId) {
                NetworkService.config.sessionId = responseSessionId;
            }
        });
    }

    static async ajax<TRequest, TResponse>(method: string, path: string, pathParams: object, request: TRequest): Promise<TResponse> {
        const fullPath = NetworkService.config.apiURL + path;
        return await ajax<TRequest, TResponse>(method, fullPath, pathParams, request);
    }
}
