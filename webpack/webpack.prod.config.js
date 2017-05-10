const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "eslint-loader",
                exclude: /node_modules/,
                enforce: "pre",
                options: {
                    parser: "babel-eslint",
                    configFile: path.resolve(__dirname, './eslint.json'),
                    parserOptions: {"ecmaVersion": 8, "sourceType": "module", "ecmaFeatures": {"jsx": true}},
                    failOnWarning: true,
                    failOnError: true,
                    cache: true
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(path.resolve(__dirname, "../build")),
        // new webpack.SourceMapDevToolPlugin({
        //     filename: 'js/[name].[chunkhash].js.map',
        //     exclude: ['vendor.js']
        // }),
        new webpack.DefinePlugin({'process.env': {NODE_ENV: '"production"'}}),
        new webpack.optimize.UglifyJsPlugin(),
        new StyleLintPlugin({
            configFile: path.resolve(__dirname, './stylelint.json'),
            context: path.resolve(__dirname, '../app'),
            files: '**/*.scss',
            syntax: "scss"
        }),
        new OptimizeCSSAssetsPlugin({
            cssProcessor: require("cssnano"),
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