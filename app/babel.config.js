let contextEnv = process.env["APP_BUILD_ENV"] || null; // NULL means default

module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
        ["@babel/plugin-proposal-decorators", {decoratorsBeforeExport: true}],
        [
            "module-resolver",
            {
                root: ["."],
                alias: {"^app/conf/(.+)": contextEnv ? `app/conf/${contextEnv}/\\1` : "app/conf/\\1"},
            },
        ],
    ],
    env: {
        production: {
            plugins: ["transform-remove-console"],
        },
    },
};
