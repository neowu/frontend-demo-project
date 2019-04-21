import React from "react";

export interface ThemeContextType {
    themeName: string;
    onChangeTheme: (themeName: string) => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({themeName: "", onChangeTheme: () => {}});

/**
 * This is widely used in the app, so we make an optimized version, rather than using @memo
 */
export function memoizeTheme<T>(fn: (themeName: string) => T): (themeName: string) => T {
    const cache: {[themeName: string]: T} = {};
    return themeName => {
        if (!cache[themeName]) {
            cache[themeName] = fn(themeName);
        }
        return cache[themeName];
    };
}
