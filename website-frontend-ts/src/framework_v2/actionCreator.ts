import {Action} from "./type";

export function actionCreator<T>(namespace: string): T {
    return new Proxy(
        {},
        {
            get: (target: {}, key: string) => {
                return (payload: any): Action => {
                    return {type: namespace + "/" + key, payload};
                };
            }
        }
    ) as T;
}
