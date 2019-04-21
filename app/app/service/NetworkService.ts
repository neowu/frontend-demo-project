import appConfig from "app/conf/default";
import {ConfigService} from "app/service/ConfigService";
import {Device} from "app/service/Device";
import {ajax, setRequestInterceptor, setResponseInterceptor} from "core-native";

interface NetworkConfig {
    apiURL: string;
    currentDomain: string;
    sessionId: string;
}

export class NetworkService {
    private static readonly config: ConfigService<NetworkConfig> = new ConfigService("network", {
        domainList: appConfig.domains,
        currentDomain: appConfig.domains[0],
        sessionId: "",
    });

    static getHTTPHeaders() {
        const headers = {
            Version: appConfig.version,
            DeviceOS: Device.os(),
            DeviceId: Device.id(),
        };
        const sessionId = NetworkService.config.get("sessionId");
        return sessionId ? {...headers, SessionId: sessionId} : headers;
    }

    static async init(api) {
        await NetworkService.config.load();
        setRequestInterceptor(request => {
            request.headers = {...request.headers, ...NetworkService.getHTTPHeaders()};
        });
        setResponseInterceptor(async response => {
            const responseSessionId = response.headers.get("SessionId");
            if (responseSessionId && responseSessionId !== NetworkService.config.get("sessionId")) {
                await NetworkService.config.update("sessionId", responseSessionId);
            }
        });
    }

    static async ajax<TRequest, TResponse>(method: string, path: string, pathParams: object, request: TRequest, isRetry: boolean = false): Promise<TResponse> {
        const fullPath = "https://localhost:8443/" + path;
        return await ajax<TRequest, TResponse>(method, fullPath, pathParams, request);
    }
}
