/* eslint-env node */
const webpack = require("webpack");
const env = require("./env");
const StylelintPlugin = require("stylelint-webpack-plugin");
const ForkTSCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const TSImportPlugin = require('ts-import-plugin');

module.exports = {
    entry: {},
    output: {
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name]-[id].js",
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
    devtool: "cheap-module-source-map",
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: env.src,
                loader: "tslint-loader",
                enforce: "pre",
                options: {
                    configFile: env.tslintConfig,
                    emitErrors: true
                }
            },
            {
                test: /\.(ts|tsx)$/,
                include: env.src,
                loader: "ts-loader",
                options: {
                    configFile: env.tsConfig,
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [TSImportPlugin({
                            libraryName: 'antd',
                            libraryDirectory: 'es',
                            style: true
                        })]
                    }),
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
                    name: "static/img/[name].[ext]"
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                loader: "file-loader",
                options: {
                    name: "static/font/[name].[ext]"
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
        new ForkTSCheckerPlugin({
            tsconfig: env.tsConfig
        }),
        new webpack.ProgressPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};
