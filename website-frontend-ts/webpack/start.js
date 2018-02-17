const chalk = require("chalk");
const webpack = require("webpack");
const env = require("./env");
const webpackConfig = require("./webpack.config.dev");
const DevServer = require("webpack-dev-server");

process.env.NODE_ENV = "development";
process.on("unhandledRejection", (error) => {
    throw error;
});

function server(compiler) {
    const rewrites = [];
    Object.keys(env.packageJSON.config.pages).forEach((name) => {
        rewrites.push({
            from: new RegExp(`/${name}`),
            to: `/${name}.html`
        });
    });
    return new DevServer(compiler, {
        contentBase: env.static,
        https: true,
        historyApiFallback: {rewrites: rewrites},
        hot: true,
        inline: true,
        compress: true,
        stats: "minimal",
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            "/ajax": {
                target: "https://localhost:8443",
                secure: false,
                changeOrigin: true
            }
        }
    });
}

function start() {
    const compiler = webpack(webpackConfig);
    const devServer = server(compiler);
    devServer.listen(7443, "localhost", (err) => {
        if (err) {
            return console.log(err);
        }
        console.log("starting the development server on", chalk.green("https://localhost:7443/\n"));
        return null;
    });

    ["SIGINT", "SIGTERM"].forEach((sig) => {
        process.on(sig, () => {
            devServer.close();
            process.exit();
        });
    });
}

start();
