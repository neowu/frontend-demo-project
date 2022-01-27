import chalk from "chalk";
import childProcess from "child_process";
import webpack from "webpack";
import fs from "fs-extra";
import env from "./env.mjs";
import webpackConfig from "./webpack.config.build.mjs";

function spawn(command, args, errorMessage) {
  const isWindows = process.platform === "win32"; // spawn with {shell: true} can solve .cmd resolving, but prettier doesn't run correctly on mac/linux
  const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, args, {stdio: "inherit"});
  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(chalk.red.bold(errorMessage));
    console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${arguments.join(" ")}`);
    process.exit(1);
  }
}

function checkCodeStyle() {
  console.info(`${chalk.green.bold("[task]")} ${chalk.white.bold("check code style")}`);
  return spawn("prettier", ["--config", "webpack/prettier.json", "--list-different", "{src,test}/**/*.{ts,tsx,less}"], "check code style failed, please format above files");
}

function test() {
  console.info(`${chalk.green.bold("[task]")} ${chalk.white.bold("test")}`);
  return spawn("jest", ["--config", "webpack/jest.json", "--detectOpenHandles"], "test failed, please fix");
}

function cleanup() {
  console.info(`${chalk.green.bold("[task]")} ${chalk.white.bold("cleanup build/dist")}`);
  fs.emptyDirSync(env.dist);
}

function copyStatic() {
  console.info(`${chalk.green.bold("[task]")} ${chalk.white.bold("copy static folder to dist")}`);
  fs.copySync(env.static, env.dist, {dereference: true});
}

function build() {
  checkCodeStyle();
  test();

  console.info(`${chalk.white.bold("[env]")} webpackJSON=${env.webpackJSON === null ? null : JSON.stringify(env.webpackJSON)}`);
  console.info(`${chalk.white.bold("[env]")} conf=${env.conf}`);

  cleanup();
  copyStatic();

  console.info(`${chalk.green.bold("[task]")} ${chalk.white.bold("webpack")}`);
  const compiler = webpack(webpackConfig);
  compiler.run((error, stats) => {
    if (error) {
      console.error(error.stack || error);
      if (error.details) console.error(error.details);
      process.exit(1);
    } else {
      console.log(stats.toString({chunks: false, colors: true}));
      if (env.profile) {
        console.info(`${chalk.green.bold("[task]")} ${chalk.white.bold("write stats.json")}`);
        fs.writeFileSync("stats.json", JSON.stringify(stats.toJson({}), null, 2));
      }
      if (stats.hasErrors() || stats.hasWarnings()) {
        process.exit(1);
      }
    }
  });
}

build();
