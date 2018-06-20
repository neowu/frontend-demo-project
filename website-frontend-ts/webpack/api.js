const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const yargs = require("yargs");
const childProcess = require("child_process");
const Agent = require("https").Agent;

const apiURL = yargs.argv.url || "https://localhost:8443/_sys/api";
const typeModule = "type";
const typeSourcePath = path.resolve(__dirname, `../src/${typeModule}/api.ts`);
const serviceModule = "service";
const serviceSourceDir = path.resolve(__dirname, `../src/${serviceModule}`);

function generateTypes(types) {
    const lines = [];
    types.forEach(type => lines.push(`export ${type.type} ${type.name} ${type.definition}`));
    fs.writeFileSync(typeSourcePath, lines.join("\n"), "utf8");
    console.info(chalk`{white.bold api type generated}, source=${typeSourcePath}`);
}

function generateService(serviceName, operations) {
    const requiredTypes = [];
    const checkType = type => {
        const baseType = type.replace("[]", "");
        if (!["void", "number", "string"].includes(baseType) && !requiredTypes.includes(baseType)) {
            requiredTypes.push(baseType);
        }
        return type;
    };

    const lines = [];
    lines.push(`import {ajax} from "core-fe";`);
    lines.push(``);
    lines.push(`class ${serviceName} {`);
    operations.forEach(operation => {
        const pathParams = "{" + operation.pathParams.map(param => param.name).join(",") + "}";

        let requestBody = "null";
        const parameters = operation.pathParams.slice();
        if (operation.requestType) {
            parameters.push({name: "request", type: operation.requestType});
            requestBody = `request`;
        }
        const parameterSignature = parameters.map(param => param.name + ":" + checkType(param.type)).join(",");

        lines.push(`${operation.name}(${parameterSignature}): Promise<${checkType(operation.responseType)}>{`);
        lines.push(`return ajax("${operation.method}", "${operation.path}", ${pathParams}, ${requestBody});`);
        lines.push("}");
    });

    lines.push(`}`);
    lines.push(`export default new ${serviceName}();`);
    if (requiredTypes.length > 0) lines.unshift(`import {${requiredTypes.join(",")}} from "${typeModule}/api";`);

    const serviceSourcePath = `${serviceSourceDir}/${serviceName}.ts`;
    fs.writeFileSync(serviceSourcePath, lines.join("\n"), "utf8");
    console.info(chalk`{white.bold api service client generated}, source=${serviceSourcePath}`);
}

function validateAPIResponse(response) {
    const contentType = response.headers["content-type"];
    if (!contentType || !contentType.startsWith("application/json")) throw new Error(`unexpected contentType, contentType=${contentType}`);
    const api = response.data;
    if (!api.types || !api.services) throw new Error(`unexpected api definition, responseText=${JSON.stringify(api)}}`);
    return api;
}

async function fetchAPIDefinition() {
    console.info(chalk`{white.bold fetching API definition}, url={green ${apiURL}}`);
    try {
        const response = await axios.get(apiURL, {httpsAgent: new Agent({rejectUnauthorized: false})});
        return validateAPIResponse(response);
    } catch (error) {
        console.error(chalk`{red.bold failed to fetch api definition, error=${error}}`);
        process.exit(1);
    }
}

function createDirs() {
    fs.emptyDirSync(serviceSourceDir);

    const typeSourceParentDir = path.resolve(typeSourcePath, "../");
    if (!fs.existsSync(typeSourceParentDir)) fs.mkdirSync(typeSourceParentDir);
}

function spawn(command, arguments) {
    const isWindows = process.platform === "win32";
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

function formatSources() {
    console.info(chalk`{white.bold format generated sources}`);
    spawn("prettier", ["--config", "webpack/prettier.json", "--write", `src/{${serviceModule},${typeModule}}/*.ts`]);
}

async function generate() {
    console.info(chalk`{white.bold usage:} yarn api / yarn api --url https://host/_sys/api`);
    const api = await fetchAPIDefinition();
    createDirs();
    generateTypes(api.types);
    api.services.forEach(service => generateService(service.name, service.operations));
    formatSources();
}

generate();
