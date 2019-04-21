let contextEnv = null; // NULL means default
// TODO: read contextEnv from command-line ?

module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    ["@babel/plugin-proposal-decorators", {decoratorsBeforeExport: true}],
    [
      "module-resolver",
      {
        root: ["."],
        alias: {"^app/conf/(.+)": contextEnv ? `portal/conf/${contextEnv}/\\1` : "app/conf/\\1"},
      },
    ],
  ],
  env: {
    production: {
      plugins: ["transform-remove-console"],
    },
  },
};
