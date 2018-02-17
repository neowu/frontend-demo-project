const webpack = require("webpack");
const env = require("./env");
const autoprefixer = require("autoprefixer");
const AutoDllPlugin = require("autodll-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const HTMLPlugin = require("html-webpack-plugin");
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
const TSImportPlugin = require('ts-import-plugin');

const config = {
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

function configureDLL() {
    Object.entries(env.packageJSON.config.lib).forEach(([name, lib]) => {
        config.plugins.push(new AutoDllPlugin({
            context: env.root,
            inject: true,
            debug: true,
            filename: "[name].[hash:8].js",
            path: "static/js",
            plugins: [
                new webpack.DefinePlugin({"process.env": {NODE_ENV: JSON.stringify("production")}}),
                new ParallelUglifyPlugin({
                    cacheDir: `${env.nodeModules}/.cache/webpack-parallel-uglify-plugin`,
                    sourceMap: true,
                    uglifyJS: {}
                }),
                new webpack.optimize.ModuleConcatenationPlugin()
            ],
            inherit: true,
            entry: {[name]: lib}
        }));
    });
}

function configurePages() {
    Object.entries(env.packageJSON.config.pages).forEach(([name, page]) => {
        config.entry[name] = `${env.src}/${page.js}`;
        config.plugins.push(new HTMLPlugin({
            filename: `${name}.html`,
            template: `${env.src}/${page.template}`,
            chunks: ["manifest", "vendor", name],
            minify: {
                collapseBooleanAttributes: true,
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                includeAutoGeneratedTags: false,
                keepClosingSlash: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeTagWhitespace: true,
                useShortDoctype: true
            }
        }));
    });
}

configureDLL();
configurePages();

module.exports = config;
