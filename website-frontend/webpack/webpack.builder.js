import webpack from "webpack";
import autoprefixer from "autoprefixer";
import CleanPlugin from "clean-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";

import {webpackConfig} from "./webpack.builder.conf";
import {validate} from "./webpack.validator";
import {configureDevServer} from "./webpack.builder.dev";
import {configurePages} from "./webpack.builder.page";
import {configureSprite} from "./webpack.builder.sprite";
import {configureLint} from "./webpack.builder.lint";
import {env, production, readJSON, resolve} from "./webpack.util";

function configureSystem(config) {
    if (config.sys === undefined) return;

    const sys = readJSON(`conf/${env}/${config.sys}`);
    if (sys.publicPath) {
        webpackConfig.output.publicPath = sys.publicPath;
    }
}

function configureAlias() {
    webpackConfig.resolve.alias = {
        conf: resolve(`conf/${env}`),
        lib: resolve("lib")
    };
}

function cssRule(include, modules) {
    return {
        test: /\.(css|less)$/,
        include: include,
        use: ExtractTextPlugin.extract({
            use: [{
                loader: "css-loader",
                options: {
                    minimize: {safe: true},
                    modules: modules,
                    sourceMap: true,
                    importLoaders: 2
                }
            }, {
                loader: "postcss-loader",
                options: {
                    sourceMap: true,
                    plugins: () => [autoprefixer]
                }
            }, {
                loader: "less-loader",
                options: {sourceMap: true}
            }],
            fallback: "style-loader"    // use style-loader in development
        })
    };
}

function configureCSSRule() {
    webpackConfig.module.rules.push(cssRule(resolve("src"), true));
    webpackConfig.module.rules.push(cssRule(resolve("node_modules"), false));   // not using css modules for lib less, e.g. antd less
}

export function build(config) {
    validate(config);

    configureCSSRule();
    configureAlias();
    configurePages(config);
    configureSprite(config);
    configureLint(config);

    if (production) {
        webpackConfig.bail = true;

        configureSystem(config);

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
    } else {
        configureDevServer(config);
    }

    return webpackConfig;
}
