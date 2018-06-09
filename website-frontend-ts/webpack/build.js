const chalk = require("chalk");
const childProcess = require("child_process");
const webpack = require("webpack");
const fs = require("fs-extra");
const env = require("./env");
const webpackConfig = require("./webpack.config.build");

function fork(modulePath, arguments, onError) {
    return new Promise((resolve, reject) => {
        const child = childProcess.fork(modulePath, arguments);
        child.on("error", error => {
            console.error(error);
            process.exit(1);
        });
        child.on("exit", code => {
            if (code !== 0) {
                onError();
                console.error(`non-zero exit code returned, code=${code}, module=${modulePath}`);
                process.exit(1);
            }
            resolve();
        });
    })
}

function checkCodeStyle() {
    console.info(chalk`{green.bold [task]} {white.bold check code style}`);
    return fork("./node_modules/.bin/prettier", ["--config", "webpack/prettier.json", "--list-different", "{src,test}/**/*.{ts,tsx,less}"], () => {
        console.error(chalk`{red.bold check code style failed, please format above files}`);
    });
}

function test() {
    console.info(chalk`{green.bold [task]} {white.bold test}`);
    return fork("./node_modules/.bin/jest", ["--config", "webpack/jest.json"], () => {
        console.error(chalk`{red.bold failed to run unit tests, please fix}`);
    });
}

function cleanup() {
    console.info(chalk`{green.bold [task]} {white.bold cleanup build/dist}`);
    fs.emptyDirSync(env.dist);
}

function copyStatic() {
    console.info(chalk`{green.bold [task]} {white.bold copy static folder to dist}`);
    fs.copySync(env.static, env.dist, {dereference: true});
}

async function build() {
    await checkCodeStyle();
    await test();

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
            console.log(stats.toString({chunks: false, colors: true, warningsFilter: /export .* was not found in/}));
            if (stats.hasErrors()) {
                process.exit(1);
            }
        }
    });
}

build();
