const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require("webpack-merge");

commonConfig = (env) => ({
    entry: {
        app: path.resolve(__dirname, '../app'),
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'js/[name].[chunkhash].js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            conf: path.join(__dirname, `conf/${env}/env.js`),
        },
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
            title: 'Webpack demo',
            template: `app/index.html`,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true
            }
        })
    ]
});

module.exports = function (env) {
    return merge(commonConfig(env), require(`./webpack.${env}.config.js`));
};