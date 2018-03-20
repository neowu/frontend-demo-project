import {Action} from "./type";

export function actionCreator<T>(namespace: string): T {
    return new Proxy({}, {
            get: (target: {}, key: string) => {
                return (payload: any): Action => {
                    const type = key.charAt(0) === "_" ? key : `${namespace}/${key}`;
                    return {type, payload};
                };
            }
        }
    ) as T;
}
