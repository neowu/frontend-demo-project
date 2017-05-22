import fs from "fs";
import path from "path";
import webpack from "webpack";

import CleanPlugin from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import HTMLPlugin from "html-webpack-plugin";
import StylelintPlugin from "stylelint-webpack-plugin";
import SpritesmithPlugin from "webpack-spritesmith";

import {validate} from "./webpack.validator";

const production = process.env.NODE_ENV === "production";

function resolve(relativePath) {
    return path.resolve(__dirname, `../${relativePath}`);
}

const webpackConfig = {
    entry: {},
    output: {
        path: resolve("build/dist"),
        filename: "js/[name].[chunkhash:8].js",
        chunkFilename: "js/[name]-[id].[chunkhash:8].js",
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
                include: resolve("src"),
                options: {
                    presets: ["es2015", "react", "stage-2"],
                    cacheDirectory: true
                }
            },
            {
                test: /\.(css|scss|sass)$/,
                include: resolve("src"),
                exclude: /\.useable\.(css|scss|sass)$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader", options: {
                            minimize: {safe: true},
                            modules: true,
                            sourceMap: true,
                            localIdentName: "[name]_[local]-[hash:base64:6]"
                        }
                    }, {
                        loader: "sass-loader", options: {sourceMap: true}
                    }],
                    fallback: "style-loader"    // use style-loader in development
                })
            },
            {
                test: /\.useable\.(css|scss|sass)$/,
                include: resolve("src"),
                use: [{
                    loader: "style-loader/useable"
                }, {
                    loader: "css-loader", options: {minimize: {safe: true}}
                }, {
                    loader: "sass-loader"
                }]
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
                test: /\.(woff|woff2|eot|ttf)$/,
                loader: "file-loader",
                options: {
                    name: "font/[name].[hash:8].[ext]"
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "css/[name].[contenthash:8].css",
            disable: !production,
            allChunks: true
        }),
        new CopyPlugin([{from: resolve("static")}])
    ]
};

function configurePages(config) {
    Object.keys(config.lib).forEach(name => {
        const chunks = [];

        Object.keys(config.pages).forEach(pageName => {
            if (config.pages[pageName].lib.indexOf(name) >= 0) {
                chunks.push(pageName);
            }
        });

        webpackConfig.entry[name] = config.lib[name];
        webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({name: name, chunks: chunks}))
    });

    webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: "manifest",
        minChunks: Infinity
    }));

    Object.keys(config.pages).forEach(name => {
        const page = config.pages[name];
        webpackConfig.entry[name] = resolve(`src/${page.js}`);
        webpackConfig.plugins.push(new HTMLPlugin({
            filename: `${name}.html`,
            template: resolve(`src/${page.template}`),
            chunks: [...page.lib, "manifest", name],
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
}

function configureSprite(config) {
    if (config.sprite === undefined) return;

    Object.keys(config.sprite).forEach(sprite => {
        const targetPNG = resolve(`build/generated/${sprite}.png`);
        const targetSCSS = resolve(`build/generated/${sprite}.scss`);

        webpackConfig.resolve.alias[`${sprite}.png`] = targetPNG;
        webpackConfig.resolve.alias[`${sprite}.scss`] = targetSCSS;
        webpackConfig.plugins.push(new SpritesmithPlugin({
            src: {
                cwd: resolve(`src/${config.sprite[sprite]}`),
                glob: "**/*.png"
            },
            target: {
                image: targetPNG,
                css: targetSCSS
            },
            apiOptions: {cssImageRef: `${sprite}.png`}
        }));
    });
}

function configureSystem(env, config) {
    if (config.sys === undefined) return;

    const sys = JSON.parse(fs.readFileSync(resolve(`conf/${env}/${config.sys}`)));
    if (sys.publicPath) {
        webpackConfig.output.publicPath = sys.publicPath;
    }
}

function configureESLint(config) {
    const eslintRule = {
        test: /\.(js|jsx)$/,
        loader: "eslint-loader",
        include: resolve("src"),
        enforce: "pre",
        options: {
            parser: "babel-eslint",
            configFile: path.resolve(__dirname, "./eslint.json"),
            parserOptions: {"sourceType": "module", "ecmaFeatures": {"jsx": true}},
            envs: ["es6"],
            failOnWarning: true,
            failOnError: true
        }
    };

    if (config.lint !== undefined && config.lint.exclude !== undefined) {
        eslintRule.exclude = resolve(`src/${config.lint.exclude}`);
    }

    webpackConfig.module.rules.push(eslintRule);
}

function configureStylelint(config) {
    const options = {
        configFile: path.resolve(__dirname, "./stylelint.json"),
        context: resolve("src"),
        files: "**/*.s[ac]ss",
        syntax: "scss"
    };

    if (config.lint !== undefined && config.lint.exclude !== undefined) {
        options.files = `!(${config.lint.exclude})/**/*.s[ac]ss`;
    }

    webpackConfig.plugins.push(new StylelintPlugin(options));
}

export default (env, config) => {
    if (env === undefined) env = "local";

    validate(env, config, production);

    webpackConfig.resolve.alias = {
        conf: resolve(`conf/${env}`),
        lib: resolve(`lib`)
    };

    configurePages(config);
    configureSprite(config);

    webpackConfig.devtool = production ? "source-map" : "cheap-module-eval-source-map";

    if (!production) {
        webpackConfig.output.filename = "js/[name].[hash:8].js";    // HMR requires non-chunkhash

        const rewrites = [];
        Object.keys(config.pages).forEach(pageName => {
            rewrites.push({from: new RegExp(`\/${pageName}`), to: `/${pageName}.html`});
        });

        webpackConfig.devServer = {
            historyApiFallback: {rewrites: rewrites},
            hot: true,
            inline: true,
            compress: true,
            stats: "minimal",
            overlay: {
                warnings: true,
                errors: true
            }
        };

        webpackConfig.plugins.push(
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin()
        )
    } else {
        configureSystem(env, config);
        configureESLint(config);

        webpackConfig.plugins.push(
            new CleanPlugin(resolve("build"), {root: resolve("")}),
            new webpack.DefinePlugin({"process.env": {NODE_ENV: "'production'"}}),
            new webpack.optimize.UglifyJsPlugin({sourceMap: true}));

        configureStylelint(config);
    }

    // console.log(JSON.stringify(webpackConfig, null, 2));

    return webpackConfig;
};
