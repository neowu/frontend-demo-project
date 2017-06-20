import webpack from "webpack";
import CleanPlugin from "clean-webpack-plugin";

import {webpackConfig} from "./webpack.builder.conf";
import {validate} from "./webpack.validator";
import {configureDevServer} from "./webpack.builder.dev";
import {configurePages} from "./webpack.builder.page";
import {configureSprite} from "./webpack.builder.sprite";
import {configureLint} from "./webpack.builder.lint";
import {production, readJSON, resolve} from "./webpack.util";

function configureSystem(env, config) {
    if (config.sys === undefined) return;

    const sys = readJSON(`conf/${env}/${config.sys}`);
    if (sys.publicPath) {
        webpackConfig.output.publicPath = sys.publicPath;
    }
}

function configureAlias(env) {
    webpackConfig.resolve.alias = {
        conf: resolve(`conf/${env}`),
        lib: resolve("lib")
    };
}

export function build(env, config) {
    if (env === undefined) env = "local";

    validate(env, config);

    configureAlias(env);
    configurePages(config);
    configureSprite(config);
    configureLint(config);

    if (!production) {
        configureDevServer(config);
    } else {
        webpackConfig.bail = true;

        configureSystem(env, config);

        webpackConfig.plugins.push(
            new CleanPlugin(resolve("build"), {root: resolve("")}),
            new webpack.DefinePlugin({"process.env": {NODE_ENV: JSON.stringify("production")}}),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                comments: false,
                compress: {
                    warnings: false,
                    collapse_vars: true,
                    reduce_vars: true
                }
            }),
            new webpack.optimize.ModuleConcatenationPlugin()
        );
    }

    return webpackConfig;
}
