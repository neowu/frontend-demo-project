import webpack from "webpack";

import {webpackConfig} from "./webpack.builder.conf";

export function configureDevServer(config) {
    const rewrites = [];
    Object.keys(config.pages).forEach((name) => {
        rewrites.push({
            from: new RegExp(`/${name}`),
            to: `/${name}.html`
        });
    });

    webpackConfig.devServer = {
        https: true,
        port: 7443,
        historyApiFallback: {rewrites: rewrites},
        hot: true,
        inline: true,
        compress: true,
        stats: "minimal",
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            "/ajax": {
                target: "https://localhost:8443",
                secure: false,
                changeOrigin: true
            }
        }
    };

    webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}
