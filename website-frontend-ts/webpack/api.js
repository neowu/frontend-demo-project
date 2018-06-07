const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const yargs = require("yargs");
const childProcess = require("child_process");
const Agent = require("https").Agent;

const apiDefinitionURL = yargs.argv.url || "https://localhost:8443/_sys/api/v2";
const apiTypeModule = "type/api";
const apiTypePath = path.resolve(__dirname, `../src/${apiTypeModule}.ts`);
const apiClientPath = path.resolve(__dirname, "../src/service");

function generateTypes(types, targetPath) {
    const lines = [];
    types.forEach(typeDefinition => lines.push(`export ${typeDefinition.type} ${typeDefinition.name} ${typeDefinition.definition}`));
    fs.writeFileSync(targetPath, lines.join("\n"), "utf8");
    console.info(chalk`{white.bold api type generated, file=${targetPath}}`);
}

function generateServiceClients(services, targetDir) {
    services.forEach(service => {
        generateServiceClass(service.name, service.operations, targetDir)
    });
}

function generateServiceClass(serviceName, operations, targetDir) {
    const requiredTypes = [];
    const checkType = type => {
        const baseType = type.replace("[]", "").trim();
        if (!["void", "number", "string"].includes(baseType) && !requiredTypes.includes(baseType)) {
            requiredTypes.push(baseType);
        }
        return type;
    };

    const lines = [];
    lines.push(`import {ajax} from "framework/ajax";`);
    lines.push(``);
    lines.push(`class ${serviceName} {`);
    operations.forEach(operation => {
        let path = `"${operation.path}"`, requestBody = `null`, responseType = operation.responseType, parameters = operation.pathParams;
        parameters.forEach(param => path += `.replace(":${param.name}", ${param.name})`);

        if (operation.requestType) {
            parameters.push({name: "request", type: operation.requestType});
            requestBody = `request`;
        }

        const parameterSignature = parameters.map(param => param.name + ":" + checkType(param.type)).join(",");
        lines.push(`${operation.name}(${parameterSignature}): Promise<${checkType(responseType)}>{`);
        lines.push(`return ajax(${path}, "${operation.method}", ${requestBody});`);
        lines.push("}");
    });

    lines.push(`}`);
    lines.push(`export default new ${serviceName}();`);
    if (requiredTypes.length > 0) lines.unshift(`import {${requiredTypes.join(",")}} from "${apiTypeModule}";`);

    const targetPath = targetDir + "/" + serviceName + ".ts";
    fs.writeFileSync(targetPath, lines.join("\n"), "utf8");
    console.info(chalk`{white.bold api service client generated, file=${targetPath}}`);
}

async function fetchAPIDefinition() {
    try {
        const response = await axios.get(apiDefinitionURL, {httpsAgent: new Agent({rejectUnauthorized: false})});
        return response.data;
    } catch (error) {
        console.error(`fail to fetch api definition, url=${apiDefinitionURL}, error=${error}`);
        process.exit(1);
    }
}

function createDirs() {
    if (!fs.existsSync(apiClientPath)) fs.mkdirSync(apiClientPath);

    const apiTypeDir = path.resolve(apiTypePath, "../");
    if (!fs.existsSync(apiTypeDir)) fs.mkdirSync(apiTypeDir);
}

async function start() {
    console.info(chalk`{white.bold usage:} yarn api / yarn api --url https://host/_sys/api`);
    console.info(chalk`{white.bold fetching API definition} url={green ${apiDefinitionURL}}`);
    const api = await fetchAPIDefinition();
    createDirs();
    generateTypes(api["types"], path.resolve(__dirname, apiTypePath));
    generateServiceClients(api["services"], apiClientPath);
    childProcess.fork("./node_modules/.bin/prettier", ["--config", "webpack/prettier.json", "--write", "src/{service,type}/*.ts"]);
}

start();
