import CopyPlugin from "copy-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";

import {production, resolve} from "./webpack.util";

// this is base webpack config, will be used by both dev and prod build
export const webpackConfig = {
    entry: {},
    output: {
        path: resolve("build/dist"),
        filename: "js/[name].[chunkhash:8].js",
        chunkFilename: "js/[name]-[id].[chunkhash:8].js",
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
                    presets: [["es2015", {modules: false}], "react", "stage-2"],
                    babelrc: false,
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
