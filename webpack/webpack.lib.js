const glob = require("glob");
const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const SpritesmithPlugin = require('webpack-spritesmith');

const production = process.env.NODE_ENV === "production";

const webpackConfig = {
    entry: {},
    output: {
        path: path.resolve(__dirname, "../build"),
        filename: "js/[name].[chunkhash:8].js",
        publicPath: "/"
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
                    use: [{loader: "css-loader"}, {loader: "sass-loader"}],
                    fallback: "style-loader"    // use style-loader in development
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: "url-loader",
                query: {
                    limit: 1024,
                    name: "img/[name].[hash:8].[ext]"
                }
            },
            {
                test: /.(woff|woff2|eot|ttf)$/,
                loader: "file-loader",
                options: {
                    name: "font/[name].[hash:8].[ext]"
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "css/[name].[chunkhash:8].css",
            disable: !production
        }),
        new CopyWebpackPlugin([{from: path.resolve(__dirname, "../static")}])
    ]
};

const configurePages = (config) => {
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
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            } : false
        }));
    });
};

const configureSprite = (config) => {
    if (config.sprite === undefined) return;

    webpackConfig.resolve.alias[`${config.sprite.name}.png`] = path.resolve(__dirname, `../generated/${config.sprite.name}.png`);
    webpackConfig.resolve.alias[`${config.sprite.name}.scss`] = path.resolve(__dirname, `../generated/${config.sprite.name}.scss`);
    webpackConfig.plugins.push(new SpritesmithPlugin({
        src: {
            cwd: path.resolve(__dirname, `../src/${config.sprite.path}`),
            glob: '**/*.png'
        },
        target: {
            image: path.resolve(__dirname, `../generated/${config.sprite.name}.png`),
            css: path.resolve(__dirname, `../generated/${config.sprite.name}.scss`)
        },
        apiOptions: {
            cssImageRef: `~${config.sprite.name}.png`
        }
    }));
};

module.exports = (env, config) => {
    if (env === undefined) env = "local";

    webpackConfig.resolve.alias = {
        conf: path.resolve(__dirname, `../conf/${env}`),
        lib: path.resolve(__dirname, `../lib`)
    };

    configurePages(config);

    configureSprite(config);

    webpackConfig.devtool = production ? "source-map" : "cheap-module-source-map";

    if (!production) {
        webpackConfig.output.filename = "js/[name].[hash:8].js";    // HMR requires non-chunkhash

        webpackConfig.devServer = {
            historyApiFallback: true,
            hot: true,
            stats: "minimal",
            overlay: {
                errors: true,
                warnings: true,
            }
        };

        webpackConfig.plugins.push(
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin()
        )
    } else {
        webpackConfig.module.rules.push({
            test: /\.(js|jsx)$/,
            loader: "eslint-loader",
            exclude: [/node_modules/, /lib/],
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