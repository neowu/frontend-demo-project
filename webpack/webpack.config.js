const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require("webpack-merge");

let commonConfig = {
    entry: {
        index: path.resolve(__dirname, '../src'),
        "page1": path.resolve(__dirname, '../src/page/page1')
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'js/[name].[chunkhash].js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ['es2015', 'react', "stage-0"],
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
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: "img/[name].[hash:7].[ext]"
                }
            },
            {
                test: /.(woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
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
                return context && context.indexOf('node_modules') >= 0;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].[chunkhash].css',
            disable: process.env.NODE_ENV === "development"
        }),
        new HtmlWebpackPlugin({
            title: 'home page',
            filename: `index.html`,
            template: `src/index.html`,
            chunks: ["vendor", "manifest", "index"],
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true
            }
        }),
        new HtmlWebpackPlugin({
            title: 'page 1',
            filename: `page1.html`,
            template: `src/page/page1/index.html`,
            chunks: ["vendor", "manifest", "page1"],
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true
            }
        })
    ]
};

module.exports = function (env) {
    if (env === undefined) env = "dev";
    commonConfig.resolve.alias = {conf: path.join(__dirname, `../conf/${env}`)};
    return merge(commonConfig, require(`./webpack.${env}.config.js`));
};