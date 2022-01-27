import path from "path";
import fs from "fs";
import yargs from "yargs";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// use "npm run build -- --env dev" or "yarn run build --env dev" to pass
const argv = yargs(process.argv.slice(2)).argv;
const env = argv.env || null;
const profile = argv.profile || false;

function resolve(relativePath) {
  return path.resolve(__dirname, `../${relativePath}`);
}

function webpackJSON() {
  if (env === null) return null;
  const path = resolve(`conf/${env}/webpack.json`);
  if (!fs.existsSync(path)) return null;

  return JSON.parse(fs.readFileSync(path));
}

export default {
  dist: resolve("build/dist"),
  src: resolve("src"),
  static: resolve("static"),
  conf: env == null ? resolve("src/conf") : resolve(`conf/${env}`),
  lib: resolve("lib"),
  tsConfig: resolve("webpack/tsconfig.json"),
  stylelintConfig: resolve("webpack/lint/stylelint.json"),
  webpackJSON: webpackJSON(),
  profile: profile,
};
