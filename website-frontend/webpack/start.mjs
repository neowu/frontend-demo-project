import chalk from "chalk";
import webpack from "webpack";
import env from "./env.mjs";
import webpackConfig from "./webpack.config.dev.mjs";
import DevServer from "webpack-dev-server";

function devServer(compiler) {
  return new DevServer(compiler, {
    static: {
      directory: env.static,
    },
    https: true,
    historyApiFallback: true,
    hot: true,
    compress: true,
    proxy: {
      "/ajax": {
        target: "https://localhost:8443/",
        secure: false,
        changeOrigin: true,
      },
    },
  });
}

function start() {
  console.info(`${chalk.white.bold("[env]")} conf=${env.conf}`);

  const compiler = webpack(webpackConfig);
  const server = devServer(compiler);
  server.listen(7443, "0.0.0.0", error => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    console.info(`starting dev server on ${chalk.green("https://localhost:7443/")}\n`);
    return null;
  });

  ["SIGINT", "SIGTERM"].forEach(signal => {
    process.on(signal, () => {
      server.close();
      process.exit();
    });
  });
}

start();
