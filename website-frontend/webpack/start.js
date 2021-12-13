const chalk = require("chalk");
const webpack = require("webpack");
const env = require("./env");
const webpackConfig = require("./webpack.config.dev");
const DevServer = require("webpack-dev-server");

function devServer(compiler) {
    return new DevServer(compiler, {
        static: {
            directory: env.static
        },
        https: true,
        historyApiFallback: true,
        hot: true,
        compress: true,
        proxy: {
            "/ajax": {
                target: "https://localhost:8443/",
                secure: false,
                changeOrigin: true,
            },
        },
    });
}

function start() {
    console.info(chalk`{white.bold [env]} conf=${env.conf}`);

    const compiler = webpack(webpackConfig);
    const server = devServer(compiler);
    server.listen(7443, "0.0.0.0", error => {
        if (error) {
            console.error(error);
            process.exit(1);
        }
        console.info(chalk`starting dev server on {green https://localhost:7443/} \n`);
        return null;
    });

    ["SIGINT", "SIGTERM"].forEach(signal => {
        process.on(signal, () => {
            server.close();
            process.exit();
        });
    });
}

start();
