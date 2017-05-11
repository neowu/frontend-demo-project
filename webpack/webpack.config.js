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

const config = {
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
                test: /\.scss$/,
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
        new webpack.optimize.CommonsChunkPlugin({
            names: "vendor",
            minChunks(module, count) {
                const context = module.context;
                return context && context.indexOf("node_modules") >= 0;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest"
        }),
        new ExtractTextPlugin({
            filename: "css/[name].[chunkhash].css",
            disable: !production
        }),
        new CopyWebpackPlugin([{from: path.resolve(__dirname, "../static")}])
    ]
};

function htmlWebpackPlugin(name, template) {
    return new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: template,
        chunks: ["vendor", "manifest", name],
        minify: production ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true
        } : false
    });
}

module.exports = function (env) {
    if (env === undefined) env = "local";

    config.resolve.alias = {conf: path.resolve(__dirname, `../conf/${env}`)};
    config.devtool = production ? "source-map" : "cheap-module-source-map";

    config.entry["index"] = path.resolve(__dirname, "../src/index.jsx");
    config.plugins.push(htmlWebpackPlugin("index", path.resolve(__dirname, "../src/index.html")));

    const pages = glob.sync("*/index.jsx", {cwd: path.resolve(__dirname, "../src/page")});
    pages.map(page => {
        const name = page.substr(0, page.indexOf("/"));
        const entry = page.substr(0, page.lastIndexOf("."));
        config.entry[entry] = path.resolve(__dirname, `../src/page/${page}`);
        config.plugins.push(htmlWebpackPlugin(entry, path.resolve(__dirname, `../src/page/${name}/index.html`)));
    });

    if (!production) {
        config.devServer = {
            historyApiFallback: true,
            stats: "minimal",
            overlay: {
                errors: true,
                warnings: true,
            }
        }
    } else {
        config.module.rules.push({
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

        config.plugins.push(...[
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

    return config;
};