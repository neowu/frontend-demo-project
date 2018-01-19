import StylelintPlugin from "stylelint-webpack-plugin";

import {webpackConfig} from "./webpack.builder.conf";
import {production, resolve} from "./webpack.util";

function configureESLint(config) {
    const eslintRule = {
        test: /\.(js|jsx)$/,
        loader: "eslint-loader",
        include: resolve("src"),
        enforce: "pre",
        options: {
            configFile: resolve("webpack/eslint.json"),
            failOnWarning: true,
            failOnError: true
        }
    };

    if (!production) {  // turn off rules to make development convenient, those rules will be applied on prod build anyway
        eslintRule.options.rules = {
            "no-console": "off"
        };
    }

    if (config.provide) {
        eslintRule.options.globals = Object.keys(config.provide);
    }

    if (config.lint && config.lint.exclude) {
        eslintRule.exclude = resolve(`src/${config.lint.exclude}`);
    }

    webpackConfig.module.rules.push(eslintRule);
}

function configureStylelint(config) {
    const options = {
        configFile: resolve("webpack/stylelint.json"),
        context: resolve("src"),
        files: "**/*.less",
        syntax: "less"
    };

    if (config.lint && config.lint.exclude) {
        options.files = `!(${config.lint.exclude})/**/*.less`;
    }

    webpackConfig.plugins.push(new StylelintPlugin(options));
}

export function configureLint(config) {
    configureESLint(config);
    configureStylelint(config);
}
