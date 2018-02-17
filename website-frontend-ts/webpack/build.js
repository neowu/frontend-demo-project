const chalk = require("chalk");
const webpack = require("webpack");
const env = require("./env");
const fs = require("fs-extra");
const webpackConfig = require("./webpack.config.build");

process.env.NODE_ENV = "production";
process.on("unhandledRejection", (error) => {
    throw error;
});

function cleanup() {
    console.info(chalk.bold.white("cleanup build/dist"));
    fs.emptyDirSync(env.dist);
}

function copyStatic() {
    console.info(chalk.bold.white("copy static folder to dist"));
    fs.copySync(env.static, env.dist, {
        dereference: true
    });
}

function build() {
    cleanup();
    copyStatic();

    const compiler = webpack(webpackConfig);
    compiler.run((error, stats) => {
        if (error) {
            console.error(error.stack || error);
            if (error.details) console.error(error.details);
            process.exit(1);
        } else {
            console.log(stats.toString({
                chunks: false,
                colors: true
            }));
            if (stats.hasErrors() || stats.hasWarnings()) {
                process.exit(1);
            }
        }
    });
}

build();
