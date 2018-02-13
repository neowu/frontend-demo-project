/* eslint-env node */
/* eslint-disable no-sync */
const path = require("path");
const fs = require("fs");
const yargs = require("yargs");

// use "npm run build -- --env dev" or "yarn run build --env dev" to pass
const env = yargs.argv.env || "local";

function resolve(relativePath) {
    return path.resolve(__dirname, `../${relativePath}`);
}

function readJSON(relativePath) {
    return JSON.parse(fs.readFileSync(resolve(relativePath)));
}

module.exports = {
    root: resolve(""),
    dist: resolve("build/dist"),
    nodeModules: resolve("node_modules"),
    src: resolve("src"),
    static: resolve("static"),
    conf: resolve(`conf/${env}`),
    lib: resolve("lib"),
    packageJSON: readJSON("package.json"),
    stylelintConfig: resolve("webpack/stylelint.json"),
    esLintConfig: resolve("webpack/eslint.json"),
    webpackJSON: readJSON(`conf/${env}/webpack.json`),
    tsConfig: resolve("webpack/tsconfig.json")
};
