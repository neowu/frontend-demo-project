const path = require("path");
const fs = require("fs");
const argv = require("yargs").argv;

// use "npm run build -- --env dev" or "yarn run build --env dev" to pass
const env = argv.env || null;

function resolve(relativePath) {
    return path.resolve(__dirname, `../${relativePath}`);
}

function json(path) {
    return JSON.parse(fs.readFileSync(path));
}

function webpackJSON() {
    if (env === null) return null;
    const path = resolve(`conf/${env}/webpack.json`);
    if (!fs.existsSync(path)) return null;

    return json(path);
}

module.exports = {
    dist: resolve("build/dist"),
    nodeModules: resolve("node_modules"),
    src: resolve("src"),
    static: resolve("static"),
    conf: env == null ? resolve("src/conf") : resolve(`conf/${env}`),
    lib: resolve("lib"),
    tsConfig: resolve("webpack/tsconfig.json"),
    tslintConfig: resolve("webpack/tslint.json"),
    stylelintConfig: resolve("webpack/stylelint.json"),
    webpackJSON: webpackJSON(),
};
