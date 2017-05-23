import fs from "fs";
import path from "path";

export const production = process.env.NODE_ENV === "production";

export function resolve(relativePath) {
    return path.resolve(__dirname, `../${relativePath}`);
}

export function readJSON(relativePath) {
    return JSON.parse(fs.readFileSync(resolve(relativePath)));
}
