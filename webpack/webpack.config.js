const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require("webpack-merge");

const PATHS = {
    app: path.resolve(__dirname, '../app'),
    build: path.resolve(__dirname, '../build')
};

const commonConfig = {
    entry: {
        app: PATHS.app,
        vendor: ["react", "react-dom"]
    },
    output: {
        path: PATHS.build,
        filename: 'js/[name].[chunkhash].js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
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
                test: /\.css$/,
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
            names: ['vendor', 'manifest']
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].[chunkhash].css',
            // disable: process.env.NODE_ENV === "development"
        }),
        new HtmlWebpackPlugin({
            title: 'Webpack demo',
            template: `app/index.html`,
            // minify: {
            //     removeComments: true,
            //     collapseWhitespace: true
            // }
        })
    ]
};

module.exports = function (env) {
    return merge(commonConfig, require(`./webpack.${env}.config.js`));
};