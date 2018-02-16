/* eslint-env node */
/* eslint-disable no-console, no-process-env, no-process-exit, no-sync */
const webpack = require("webpack");
const env = require("./env");
const fs = require("fs-extra");
const webpackConfig = require("./webpack.config.dev");
const DevServer = require("webpack-dev-server");
const AutoDllPlugin = require("autodll-webpack-plugin");
const HTMLPlugin = require("html-webpack-plugin");

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";
process.on("unhandledRejection", (error) => {
    throw error;
});

function configureDLL(config) {
    Object.entries(env.packageJSON.config.lib).forEach(([name, lib]) => {
        config.plugins.push(new AutoDllPlugin({
            context: env.root,
            inject: true,
            debug: true,
            filename: "[name].js",
            path: "static/js",
            inherit: true,
            entry: {[name]: lib}
        }));
    });
}

function configurePages(config) {
    Object.entries(env.packageJSON.config.pages).forEach(([name, page]) => {
        webpackConfig.entry[name] = `${env.src}/${page.js}`;
        webpackConfig.plugins.push(new HTMLPlugin({
            filename: `${name}.html`,
            template: `${env.src}/${page.template}`,
            chunks: ["manifest", "vendor", name]
        }));
    });
}

configureDLL(webpackConfig);
configurePages(webpackConfig);

const rewrites = [];
Object.keys(env.packageJSON.config.pages).forEach((name) => {
    rewrites.push({
        from: new RegExp(`/${name}`),
        to: `/${name}.html`
    });
});

const compiler = webpack(webpackConfig);
const devServer = new DevServer(compiler, {
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
devServer.listen(7443, "localhost", (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("starting the development server on https://localhost:7443/\n");
    return null;
});

["SIGINT", "SIGTERM"].forEach((sig) => {
    process.on(sig, () => {
        devServer.close();
        process.exit();
    });
});
