export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type KeysOfType<T, ExpectedKeyType> = {[P in keyof T]: T[P] extends ExpectedKeyType ? P : never}[keyof T];

export type PickOptional<T> = Pick<T, {[K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never}[keyof T]>;
