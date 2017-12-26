import autoprefixer from "autoprefixer";

import CopyPlugin from "copy-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";

import {production, resolve} from "./webpack.util";

// this is base webpack config, will be used by both dev and prod build
export const webpackConfig = {
    entry: {},
    output: {
        path: resolve("build/dist"),
        filename: "static/js/[name].[chunkhash:8].js",
        chunkFilename: "static/js/[name]-[id].[chunkhash:8].js",
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
                test: /\.(css|less)$/,
                include: resolve("src"),
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: {safe: true},
                            modules: true,
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
            },
            {
                test: /\.(css|less)$/,
                include: resolve("node_modules"),
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: {safe: true},
                            modules: false,
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
        new CopyPlugin([{from: resolve("static")}])
    ]
};
