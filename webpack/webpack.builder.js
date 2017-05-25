import webpack from "webpack";
import CleanPlugin from "clean-webpack-plugin";

import {webpackConfig} from "./webpack.builder.conf";
import {validate} from "./webpack.validator";
import {configurePages} from "./webpack.builder.page";
import {configureSprite} from "./webpack.builder.css";
import {configureLint} from "./webpack.builder.lint";
import {production, readJSON, resolve} from "./webpack.util";

function configureSystem(env, config) {
    if (config.sys === undefined) return;

    const sys = readJSON(`conf/${env}/${config.sys}`);
    if (sys.publicPath) {
        webpackConfig.output.publicPath = sys.publicPath;
    }
}

function configureDevServer(config) {
    webpackConfig.output.filename = "js/[name].[hash:8].js";    // HMR requires non-chunkhash

    const rewrites = [];
    Object.keys(config.pages).forEach(pageName => {
        rewrites.push({from: new RegExp(`\/${pageName}`), to: `/${pageName}.html`});
    });

    webpackConfig.devServer = {
        historyApiFallback: {rewrites: rewrites},
        hot: true,
        inline: true,
        compress: true,
        stats: "minimal",
        overlay: {
            warnings: true,
            errors: true
        }
    };

    webpackConfig.plugins.push(
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    );
}

export function build(env, config) {
    if (env === undefined) env = "local";

    validate(env, config);

    webpackConfig.resolve.alias = {
        conf: resolve(`conf/${env}`),
        lib: resolve("lib")
    };

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
            })
        );
    }

    // console.log(JSON.stringify(webpackConfig, null, 2));

    return webpackConfig;
}
