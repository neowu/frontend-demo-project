import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";

import {production, resolve} from "./webpack.util";

// this is base webpack config, will be used by both dev and prod build
export const webpackConfig = {
    entry: {},
    output: {
        path: resolve("build/dist"),
        filename: production ? "static/js/[name].[chunkhash:8].js" : "static/js/[name].js",
        chunkFilename: production ? "static/js/[name]-[id].[chunkhash:8].js" : "static/js/[name]-[id].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".jsx"],
        modules: [resolve("node_modules")]
    },
    devtool: production ? "source-map" : "cheap-module-eval-source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                include: resolve("src"),
                options: {
                    presets: [["env", {
                        targets: {
                            browsers: ["ie >= 9"]
                        },
                        modules: false
                    }], "react", "stage-2"],
                    plugins: [["import", {
                        libraryName: "antd",
                        libraryDirectory: "es",
                        style: true
                    }]],
                    babelrc: false,
                    cacheDirectory: true
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: "url-loader",
                query: {
                    limit: 1024,
                    name: "static/img/[name].[hash:8].[ext]"
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                loader: "file-loader",
                options: {
                    name: "static/font/[name].[hash:8].[ext]"
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "static/css/[name].[contenthash:8].css",
            disable: !production,
            allChunks: true
        }),
        new CopyPlugin([{from: resolve("static")}]),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function (module) {
                return module.context && module.context.includes("node_modules");
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity
        }),
        new webpack.NamedModulesPlugin()    // even though webpack doc recommends HashedModuleIdsPlugin, NamedModulesPlugin results in smaller file after gzip
    ]
};
