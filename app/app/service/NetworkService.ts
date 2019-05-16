import appConfig from "app/conf/default";
import {Device} from "app/service/Device";
import {ajax, setRequestInterceptor, setResponseInterceptor} from "core-native";

export class NetworkService {
    private static readonly config = {
        sessionId: "",
    };

    static getHTTPHeaders() {
        const headers = {
            Version: appConfig.version,
            DeviceOS: Device.os(),
            DeviceId: Device.id(),
        };
        const sessionId = NetworkService.config.sessionId;
        return sessionId ? {...headers, SessionId: sessionId} : headers;
    }

    static async init() {
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

    static async ajax<TRequest, TResponse>(method: string, path: string, pathParams: object, request: TRequest, isRetry: boolean = false): Promise<TResponse> {
        const fullPath = "https://api:8443" + path;
        return await ajax<TRequest, TResponse>(method, fullPath, pathParams, request);
    }
}
