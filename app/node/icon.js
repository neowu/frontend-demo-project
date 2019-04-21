const chalk = require("chalk");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const yargs = require("yargs");
const Agent = require("https").Agent;

const componentBoilerplatePath = path.resolve(__dirname, "./icon-boilerplate/Icon.tsx");
const componentPath = path.resolve(__dirname, "../app/component/library/src/Icon.tsx");
const androidFontPath = path.resolve(__dirname, "../android/app/src/main/assets/fonts/iconfont.ttf");
const iosFontPath = path.resolve(__dirname, "../ios/fonts/iconfont.ttf");

async function parseCSS(content) {
    // Retrieve icon items
    const iconClassList = [];
    const iconClassRegex = /\.icon-?(.*)\:before(?:.|\n)*?"\\(.*)"/g;
    let matchedClassAndUnicode;
    while ((matchedClassAndUnicode = iconClassRegex.exec(content)) !== null) {
        iconClassList.push(`${classNameToEnum(matchedClassAndUnicode[1])} = 0x${matchedClassAndUnicode[2]}`);
    }

    // Retrieve TTF URL
    const matchedURL = /url\('(.*?\.ttf).*?'\)/.exec(content);
    if (!matchedURL) throw new Error("Cannot find TTF Path");
    const ttfURL = matchedURL[1];  // Captured URL part
    console.info(chalk`{white.bold 😍 Downloading TTF: ${ttfURL}}`);

    // Download TTF to iOS/Android folder
    await downloadFontAsset(ttfURL, androidFontPath);
    await downloadFontAsset(ttfURL, iosFontPath);

    // Copy boilerplate to target
    const componentContent = fs.readFileSync(componentBoilerplatePath).toString()
        .replace("// {1}", iconClassList.map(_ => `    ${_},`).join("\n"));
    fs.writeFileSync(componentPath, componentContent);

    console.info(chalk`{white.bold 😍 Generated ${iconClassList.length} icons}`);
}

function classNameToEnum(className) {
    if (!/^[a-z\d]+(-[a-zA-Z\d]+)*$/.test(className)) {
        throw new Error(`${className} does not conform to naming convention`);
    }

    return className.replace(/-/g, "_").toUpperCase();
}

async function downloadFontAsset(url, path) {
    if (url.startsWith("//")) url = "http:" + url;
    const response = await axios({url, responseType: "stream"});
    response.data.pipe(fs.createWriteStream(path));
    return new Promise((resolve, reject) => {
        response.data.on('end', resolve);
        response.data.on('error', reject);
    });
}

async function getContent(url) {
    if (url.startsWith("//")) url = "http:" + url;
    const response = await axios.get(url, {httpsAgent: new Agent({rejectUnauthorized: false})});
    return response.data;
}

async function generate() {
    console.info(chalk`{white.bold usage:} yarn icon \{icon-font-css-url\}`);
    const cssURL = yargs.argv._[0];

    try {
        if (!cssURL) throw new Error("Missing CSS URL in command line");

        const cssContent = await getContent(cssURL);
        await parseCSS(cssContent);
    } catch (e) {
        console.error(chalk`{red.bold ❌ Error: ${e.message}}`);
        process.exit(1);
    }
}

generate();
