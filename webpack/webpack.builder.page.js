import webpack from "webpack";
import HTMLPlugin from "html-webpack-plugin";

import {production, resolve} from "./webpack.util";
import {webpackConfig} from "./webpack.builder.conf";

export function configurePages(config) {
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

    const minify = {
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
    };

    Object.keys(config.pages).forEach(name => {
        const page = config.pages[name];
        webpackConfig.entry[name] = resolve(`src/${page.js}`);
        webpackConfig.plugins.push(new HTMLPlugin({
            filename: `${name}.html`,
            template: resolve(`src/${page.template}`),
            chunks: ["manifest", ...page.lib, name],
            minify: production ? minify : false
        }));
    });
}
