/* eslint-env node */
const webpack = require("webpack");
const env = require("./env");
const autoprefixer = require("autoprefixer");
const StylelintPlugin = require("stylelint-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {},
    output: {
        path: env.dist,
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name]-[id].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".jsx"],
        modules: [env.nodeModules],
        alias: {
            conf: env.conf,
            lib: env.lib
        }
    },
    devtool: "cheap-module-source-map",
    module: {
        rules: [
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
                            modules: true,
                            importLoaders: 2
                        }
                    }, {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [autoprefixer]
                        }
                    }, {
                        loader: "less-loader"
                    }],
                    fallback: "style-loader"    // use style-loader in development
                })
            },
            {
                test: /\.(css|less)$/,
                include: env.nodeModules,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            modules: false,
                            importLoaders: 2
                        }
                    }, {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [autoprefixer]
                        }
                    }, {
                        loader: "less-loader"
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
            disable: true,
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
        new webpack.ProgressPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        https: true,
        port: 7443,
        historyApiFallback: {rewrites: []},
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
    }
};
