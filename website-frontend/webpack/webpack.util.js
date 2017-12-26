/* eslint-env node */
/* eslint-disable no-sync, no-process-env */
import fs from "fs";
import path from "path";
import {argv} from "yargs";

export const production = process.env.NODE_ENV === "production";

// use "npm run build -- --env dev" or "yarn run build --env dev" to pass
export const env = argv.env || "local";

export function resolve(relativePath) {
    return path.resolve(__dirname, `../${relativePath}`);
}

export function readJSON(relativePath) {
    return JSON.parse(fs.readFileSync(resolve(relativePath)));
}
