import {AsyncStorage} from "react-native";

export class ConfigService<T extends {[key: string]: any}> {
    private currentConfig: T | null = null;

    constructor(private storageKey: string, private defaultConfig: T) {}

    async load() {
        const result = {};
        for (const key of Object.keys(this.defaultConfig)) {
            result[key] = this.defaultConfig[key];
            const storedValue = await AsyncStorage.getItem(this.getKey(key));
            if (storedValue !== null) {
                try {
                    result[key] = JSON.parse(storedValue);
                } catch (e) {
                    // Fall back to defaultData[key]
                }
            }
        }
        this.currentConfig = result as T;
        console.info(`[${this.storageKey}] Config loaded`, this.currentConfig);
    }

    get<K extends keyof T>(key: K): T[K] {
        if (this.currentConfig === null) {
            throw new Error(`Config [${this.storageKey}] has not been loaded`);
        }
        return this.currentConfig[key];
    }

    async update<K extends keyof T>(key: K, value: NonNullable<T[K]>) {
        if (this.currentConfig === null) {
            throw new Error(`Config [${this.storageKey}] has not been loaded`);
        }

        this.currentConfig[key] = value;
        const serializedValue = JSON.stringify(value);
        await AsyncStorage.setItem(this.getKey(key), serializedValue);
        console.info(`[${this.storageKey}] Update config ${key} = ${serializedValue}`);
    }

    private getKey(key: keyof T): string {
        return `${this.storageKey}.${key}`;
    }
}
