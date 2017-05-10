const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const CleanWebpackPlugin = require("clean-webpack-plugin");

const component = require("./webpack.component.config");

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

const commonConfig = {
    devtool: 'source-map',
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
            // {
            //     test: /\.(js|jsx)$/,
            //     loader: "eslint-loader",
            //     exclude: /node_modules/,
            //     enforce: "pre",
            //     options: {
            //         configFile: "eslint.json",
            //         parserOptions: {"ecmaVersion": 2015, "sourceType": "module", "ecmaFeatures": {"jsx": true}},
            //         failOnWarning: true,
            //         failOnError: true,
            //         cache: true
            //     }
            // },
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
        new CleanWebpackPlugin("build"),
        new webpack.DefinePlugin({'process.env': {NODE_ENV: '"production"'}}),
        // new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new ExtractTextPlugin({filename: 'css/[name].[chunkhash].css',}),
        new HtmlWebpackPlugin({
            title: 'Webpack demo',
            template: `app/index.html`,
        }),
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

const developmentConfig = Object.assign({}, commonConfig, component.devServer());

module.exports = (env) => {
    if (env === 'prod') {
        return productionConfig();
    }

    return developmentConfig;
};