const webpack = require("webpack");
const env = require("./env");
const AutoDllPlugin = require("autodll-webpack-plugin");
const HTMLPlugin = require("html-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const ForkTSCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const TSImportPlugin = require("ts-import-plugin");

const config = {
    entry: {},
    output: {
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name]-[id].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        modules: [env.src, env.nodeModules],
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
                loader: "ts-loader",
                options: {
                    configFile: env.tsConfig,
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [TSImportPlugin({
                            libraryName: "antd",
                            libraryDirectory: "es",
                            style: true
                        })]
                    }),
                }
            },
            {
                test: /\.(css|less)$/,
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
            tsconfig: env.tsConfig,
            tslint: env.tslintConfig,
            workers: ForkTSCheckerPlugin.TWO_CPUS_FREE
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};

function configureDLL() {
    Object.entries(env.packageJSON.config.lib).forEach(([name, lib]) => {
        config.plugins.push(new AutoDllPlugin({
            context: env.root,
            inject: true,
            debug: true,
            filename: "[name].js",
            path: "static/js",
            inherit: true,
            entry: {[name]: lib}
        }));
    });
}

function configurePages() {
    Object.entries(env.packageJSON.config.pages).forEach(([name, page]) => {
        config.entry[name] = ["webpack-dev-server/client?https://0.0.0.0:7443", "webpack/hot/dev-server", `${env.src}/${page.js}`];
        config.plugins.push(new HTMLPlugin({
            filename: `${name}.html`,
            template: `${env.src}/${page.template}`,
            chunks: ["manifest", "vendor", name]
        }));
    });
}

configureDLL(config);
configurePages(config);

module.exports = config;
