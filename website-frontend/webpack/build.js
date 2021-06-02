const chalk = require("chalk");
const childProcess = require("child_process");
const webpack = require("webpack");
const fs = require("fs-extra");
const env = require("./env");
const webpackConfig = require("./webpack.config.build");

function spawn(command, arguments, errorMessage) {
    const isWindows = process.platform === "win32"; // spawn with {shell: true} can solve .cmd resolving, but prettier doesn't run correctly on mac/linux
    const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, arguments, {stdio: "inherit"});
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(chalk`{red.bold ${errorMessage}}`);
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${arguments.join(" ")}`);
        process.exit(1);
    }
}

function checkCodeStyle() {
    console.info(chalk`{green.bold [task]} {white.bold check code style}`);
    return spawn("prettier", ["--config", "webpack/prettier.json", "--list-different", "{src,test}/**/*.{ts,tsx,less}"], "check code style failed, please format above files");
}

function test() {
    console.info(chalk`{green.bold [task]} {white.bold test}`);
    return spawn("jest", ["--config", "webpack/jest.json", "--detectOpenHandles"], "test failed, please fix");
}

function cleanup() {
    console.info(chalk`{green.bold [task]} {white.bold cleanup build/dist}`);
    fs.emptyDirSync(env.dist);
}

function copyStatic() {
    console.info(chalk`{green.bold [task]} {white.bold copy static folder to dist}`);
    fs.copySync(env.static, env.dist, {dereference: true});
}

function build() {
    checkCodeStyle();
    test();

    console.info(chalk`{white.bold [env]} webpackJSON=${env.webpackJSON === null ? null : JSON.stringify(env.webpackJSON)}`);
    console.info(chalk`{white.bold [env]} conf=${env.conf}`);

    cleanup();
    copyStatic();

    console.info(chalk`{green.bold [task]} {white.bold webpack}`);
    const compiler = webpack(webpackConfig);
    compiler.run((error, stats) => {
        if (error) {
            console.error(error.stack || error);
            if (error.details) console.error(error.details);
            process.exit(1);
        } else {
            console.log(stats.toString({chunks: false, colors: true}));
            if (env.profile) {
                console.info(chalk`{green.bold [task]} write stats.json`);
                fs.writeFileSync("stats.json", JSON.stringify(stats.toJson({}), null, 2));
            }
            if (stats.hasErrors() || stats.hasWarnings()) {
                process.exit(1);
            }
        }
    });
}

build();
