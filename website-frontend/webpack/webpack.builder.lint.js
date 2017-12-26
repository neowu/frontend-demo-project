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
            parser: "babel-eslint",
            configFile: resolve("webpack/eslint.json"),
            parserOptions: {
                sourceType: "module",
                ecmaFeatures: {jsx: true}
            },
            envs: ["es6", "browser"],
            failOnWarning: true,
            failOnError: true
        }
    };

    if (!production) {  // turn off rules to make development convenient, those rules will be applied on prod build anyway
        eslintRule.options.rules = {
            "no-console": "off"
        };
    }

    if (config.provide !== undefined) {
        eslintRule.options.globals = Object.keys(config.provide);
    }

    if (config.lint !== undefined && config.lint.exclude !== undefined) {
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

    if (config.lint !== undefined && config.lint.exclude !== undefined) {
        options.files = `!(${config.lint.exclude})/**/*.less`;
    }

    webpackConfig.plugins.push(new StylelintPlugin(options));
}

export function configureLint(config) {
    configureESLint(config);
    configureStylelint(config);
}
