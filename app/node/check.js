const chalk = require("chalk");
const childProcess = require("child_process");

function spawn(command, arguments) {
    const isWindows = process.platform === "win32"; // spawn with {shell: true} can solve .cmd resolving, but prettier doesn't run correctly on mac/linux
    const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, arguments, {stdio: "inherit"});
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${arguments.join(" ")}`);
        process.exit(1);
    }
}

function test() {
    console.info(chalk`{green.bold [task]} {white.bold Unit Test}`);
    return spawn("jest", ["--config", "node/jest.json"]);
}

function checkPrettier() {
    console.info(chalk`{green.bold [task]} {white.bold Check Prettier}`);
    spawn("prettier", ["--config", "node/prettier.json", "--list-different", "{app,test}/**/*.{ts,tsx}"]);
    spawn("prettier", ["--config", "node/prettier.json", "--list-different", "index.js"]);
}

function checkTypeScript() {
    console.info(chalk`{green.bold [task]} {white.bold Check TypeScript}`);
    spawn("tsc", ["-p", "./tsconfig.json"]);
}

function checkLint() {
    console.info(chalk`{green.bold [task]} {white.bold Check Lint}`);
    // Always re-compile the lint rule (ts) into js
    spawn("tsc", ["-p", "node/lint/lintTSConfig.json"]);
    spawn("tslint", ["--config", "./tslint.json", "{app,test}/**/*.{ts,tsx}"]);
}

function run() {
    test();
    checkPrettier();
    checkTypeScript();
    checkLint();
}

run();
