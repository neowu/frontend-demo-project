const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const CleanWebpackPlugin = require("clean-webpack-plugin");

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

const commonConfig = {
    entry: {
        app: PATHS.app
    },
    output: {
        path: PATHS.build,
        filename: 'js/[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "eslint-loader",
                exclude: /node_modules/,
                enforce: "pre",
                options: {
                    configFile: "eslint.json",
                    parserOptions: {"ecmaVersion": 2015, "sourceType": "module"},
                    failOnWarning: true,
                    failOnError: true,
                    cache: true
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: [['es2015', {loose: true}]],
                    cacheDirectory: true
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"})
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
        new CleanWebpackPlugin([PATHS.build]),
        new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"', test: "abc" } }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new ExtractTextPlugin({filename: 'css/[name].[chunkhash].css',}),
        new HtmlWebpackPlugin({title: 'Webpack demo'}),
        new StyleLintPlugin({
            configFile: './stylelint.json',
            context: PATHS.app,
            files: '**/*.css'
        }),
        new OptimizeCSSAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true,
                },
                safe: true,
            },
            canPrint: false,
        }),
    ]
};


const productionConfig = () => commonConfig;

const developmentConfig = () => {
    const config = {
        devServer: {
            historyApiFallback: true,
            stats: 'errors-only',
            host: process.env.HOST, // Defaults to `localhost`
            port: process.env.PORT, // Defaults to 8080
            overlay: {
                errors: true,
                warnings: true,
            },
        },
    };

    return Object.assign({}, commonConfig, config);
};


module.exports = (env) => {
    if (env === 'prod') {
        return productionConfig();
    }

    return developmentConfig();
};