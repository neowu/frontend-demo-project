import webpack from "webpack";

import CleanPlugin from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";

import {validate} from "./webpack.validator";
import {configurePages} from "./webpack.builder.page";
import {configureSprite} from "./webpack.builder.css";
import {configureLint} from "./webpack.builder.lint";
import {production, readJSON, resolve} from "./webpack.util";

export const webpackConfig = {
    entry: {},
    output: {
        path: resolve("build/dist"),
        filename: "js/[name].[chunkhash:8].js",
        chunkFilename: "js/[name]-[id].[chunkhash:8].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    devtool: production ? "source-map" : "cheap-module-eval-source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                include: resolve("src"),
                options: {
                    presets: ["es2015", "react", "stage-2"],
                    cacheDirectory: true
                }
            },
            {
                test: /\.(css|scss|sass)$/,
                include: resolve("src"),
                exclude: /\.useable\.(css|scss|sass)$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader", options: {
                            minimize: {safe: true},
                            modules: true,
                            sourceMap: true,
                            localIdentName: "[name]_[local]-[hash:base64:6]"
                        }
                    }, {
                        loader: "sass-loader", options: {sourceMap: true}
                    }],
                    fallback: "style-loader"    // use style-loader in development
                })
            },
            {
                test: /\.useable\.(css|scss|sass)$/,
                include: resolve("src"),
                use: [{
                    loader: "style-loader/useable"
                }, {
                    loader: "css-loader", options: {minimize: {safe: true}}
                }, {
                    loader: "sass-loader"
                }]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: "url-loader",
                query: {
                    limit: 1024,
                    name: "img/[name].[hash:8].[ext]"
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                loader: "file-loader",
                options: {
                    name: "font/[name].[hash:8].[ext]"
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "css/[name].[contenthash:8].css",
            disable: !production,
            allChunks: true
        }),
        new CopyPlugin([{from: resolve("static")}])
    ]
};

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
        lib: resolve(`lib`)
    };

    configurePages(config);
    configureSprite(config);
    configureLint(config);

    if (!production) {
        configureDevServer(config);
    } else {
        configureSystem(env, config);

        webpackConfig.plugins.push(
            new CleanPlugin(resolve("build"), {root: resolve("")}),
            new webpack.DefinePlugin({"process.env": {NODE_ENV: "'production'"}}),
            new webpack.optimize.UglifyJsPlugin({sourceMap: true})
        );
    }

    // console.log(JSON.stringify(webpackConfig, null, 2));

    return webpackConfig;
}
