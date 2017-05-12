const glob = require("glob");
const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const production = process.env.NODE_ENV === "production";

const webpackConfig = {
    entry: {},
    output: {
        path: path.resolve(__dirname, "../build"),
        filename: "js/[name].[chunkhash].js"
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["es2015", "react", "stage-0"],
                    cacheDirectory: true
                }
            },
            {
                test: /\.(css|scss|sass)$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    fallback: "style-loader"    // use style-loader in development
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                query: {
                    limit: 10000,
                    name: "img/[name].[hash:7].[ext]"
                }
            },
            {
                test: /.(woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader",
                options: {
                    name: "fonts/[name].[hash:7].[ext]"
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "css/[name].[chunkhash].css",
            disable: !production
        }),
        new CopyWebpackPlugin([{from: path.resolve(__dirname, "../static")}])
    ]
};

module.exports = (env, config) => {
    if (env === undefined) env = "local";

    Object.keys(config.lib).forEach((name) => {
        const chunks = [];

        Object.keys(config.pages).forEach((pageName) => {
            if (config.pages[pageName].dependencies.indexOf(name) >= 0) {
                chunks.push(pageName);
            }
        });

        webpackConfig.entry[name] = config.lib[name];
        webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            name: name,
            chunks: chunks,
        }))
    });

    webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: "manifest",
        minChunks: Infinity
    }));

    Object.keys(config.pages).forEach((name) => {
        const page = config.pages[name];
        webpackConfig.entry[name] = path.resolve(__dirname, `../src/${page.js}`);
        webpackConfig.plugins.push(new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `../src/${page.template}`),
            chunks: [...page.dependencies, "manifest", name],
            minify: production ? {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true
            } : false
        }));
    });

    webpackConfig.resolve.alias = {conf: path.resolve(__dirname, `../conf/${env}`)};
    webpackConfig.devtool = production ? "source-map" : "cheap-module-source-map";

    if (!production) {
        webpackConfig.devServer = {
            historyApiFallback: true,
            stats: "minimal",
            overlay: {
                errors: true,
                warnings: true,
            }
        }
    } else {
        webpackConfig.module.rules.push({
            test: /\.(js|jsx)$/,
            loader: "eslint-loader",
            exclude: /node_modules/,
            enforce: "pre",
            options: {
                parser: "babel-eslint",
                configFile: path.resolve(__dirname, "./eslint.json"),
                parserOptions: {"ecmaVersion": 8, "sourceType": "module", "ecmaFeatures": {"jsx": true}},
                failOnWarning: true,
                failOnError: true
            }
        });

        webpackConfig.plugins.push(...[
            new CleanWebpackPlugin(path.resolve(__dirname, "../build"), {root: path.resolve(__dirname, "../")}),
            new webpack.DefinePlugin({"process.env": {NODE_ENV: "'production'"}}),
            new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
            new StyleLintPlugin({
                configFile: path.resolve(__dirname, "./stylelint.json"),
                context: path.resolve(__dirname, "../src"),
                files: "**/*.scss",
                syntax: "scss"
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessor: require("cssnano"),
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true,
                    },
                    safe: true
                },
                canPrint: false
            })]);
    }

    // console.log(JSON.stringify(webpackConfig, null, 2));

    return webpackConfig;
};