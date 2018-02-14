/* eslint-env node */
const webpack = require("webpack");
const env = require("./env");
const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");

module.exports = {
    entry: {},
    output: {
        path: env.dist,
        filename: "static/js/[name].[chunkhash:8].js",
        chunkFilename: "static/js/[name]-[id].[chunkhash:8].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        modules: [env.nodeModules],
        alias: {
            conf: env.conf,
            lib: env.lib
        }
    },
    devtool: "nosources-source-map",
    bail: true,
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: env.src,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [["@babel/env", {
                                targets: {
                                    browsers: ["ie >= 9"]
                                },
                                modules: false
                            }], "@babel/react", "@babel/stage-2"],
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
                        loader: "ts-loader",
                        options: {
                            configFile: env.tsConfig
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                loader: "eslint-loader",
                include: env.src,
                enforce: "pre",
                options: {
                    configFile: env.esLintConfig,
                    failOnWarning: true,
                    failOnError: true
                }
            },
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                include: env.src,
                options: {
                    presets: [["@babel/env", {
                        targets: {
                            browsers: ["ie >= 9"]
                        },
                        modules: false
                    }], "@babel/react", "@babel/stage-2"],
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
                include: env.src,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            modules: true,
                            minimize: {safe: true},
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
                        options: {
                            sourceMap: true
                        }
                    }]
                })
            },
            {
                test: /\.(css|less)$/,
                include: env.nodeModules,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            modules: false,
                            minimize: {safe: true},
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
                        options: {
                            sourceMap: true
                        }
                    }]
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
        new webpack.DefinePlugin({"process.env": {NODE_ENV: JSON.stringify("production")}}),
        new ExtractTextPlugin({
            filename: "static/css/[name].[contenthash:8].css",
            allChunks: true
        }),
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
        new webpack.NamedModulesPlugin(),    // even though webpack doc recommends HashedModuleIdsPlugin, NamedModulesPlugin results in smaller file after gzip
        new StylelintPlugin({
            configFile: env.stylelintConfig,
            context: env.src,
            files: "**/*.less",
            syntax: "less"
        }),
        new ParallelUglifyPlugin({
            cacheDir: `${env.nodeModules}/.cache/webpack-parallel-uglify-plugin`,
            sourceMap: true,
            uglifyJS: {}
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.ProgressPlugin()
    ]
};
