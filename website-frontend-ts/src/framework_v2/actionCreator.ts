export function actionCreator<T>(namespace: string): T {
    return new Proxy(
        {},
        {
            get: (target: {}, key: string) => {
                return (data: any) => {
                    return {type: namespace + "/" + key, data};
                };
            }
        }
    ) as T;
}
