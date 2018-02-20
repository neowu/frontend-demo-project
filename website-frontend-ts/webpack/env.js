const path = require("path");
const fs = require("fs");
const yargs = require("yargs");

// use "npm run build -- --env dev" or "yarn run build --env dev" to pass
const env = yargs.argv.env || null;

function resolve(relativePath) {
    return path.resolve(__dirname, `../${relativePath}`);
}

function readJSON(relativePath) {
    return JSON.parse(fs.readFileSync(resolve(relativePath)));
}

module.exports = {
    env: env,
    root: resolve(""),
    dist: resolve("build/dist"),
    nodeModules: resolve("node_modules"),
    src: resolve("src"),
    static: resolve("static"),
    conf: resolve(`conf/${env == null ? "local" : env}`),
    lib: resolve("lib"),
    packageJSON: readJSON("package.json"),
    tsConfig: resolve("webpack/tsconfig.json"),
    tslintConfig: resolve("webpack/tslint.json"),
    stylelintConfig: resolve("webpack/stylelint.json"),
    webpackJSON: env === null ? null : readJSON(`conf/${env}/webpack.json`)
};
