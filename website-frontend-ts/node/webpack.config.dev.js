/* eslint-env node */
const webpack = require("webpack");
const env = require("./env");
const StylelintPlugin = require("stylelint-webpack-plugin");

module.exports = {
    entry: {},
    output: {
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
                use: ["style-loader", {
                    loader: "css-loader",
                    options: {
                        modules: true
                    }
                }, "less-loader"]
            },
            {
                test: /\.(css|less)$/,
                include: env.nodeModules,
                use: ["style-loader", "css-loader", "less-loader"]
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
        new webpack.NamedModulesPlugin(),
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
