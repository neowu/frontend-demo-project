import fs from "fs";
import path from "path";
import glob from "glob";

const errors = [];

function assertFileExists(relativePath, key) {
    let absolutePath = path.resolve(__dirname, relativePath);
    if (!fs.existsSync(absolutePath)) {
        errors.push(`${key} => file does not exist, path=${absolutePath}`);
    }
}

function validateLib(config, usedLib) {
    Object.keys(config.lib).forEach(lib => {
        if (!usedLib.has(lib)) {
            errors.push(`config.lib["${lib}"] => lib is not used by any page, lib=${lib}`);
        }
    });
}

function validatePages(config, usedLib) {
    Object.keys(config.pages).forEach(pageName => {
        const page = config.pages[pageName];
        assertFileExists(`../src/${page.js}`, `config.pages["${pageName}"].js`);
        assertFileExists(`../src/${page.template}`, `config.pages["${pageName}"].template`);

        page.lib.forEach(lib => {
            if (config.lib[lib] === undefined) {
                errors.push(`config.pages["${pageName}"].lib => lib is not defined in config.lib, lib=${lib}`);
            } else {
                usedLib.add(lib);
            }
        });
    });
}

function validateSprite(config) {
    if (config.sprite === undefined) return;

    Object.keys(config.sprite).forEach(sprite => {
        const imageDir = path.resolve(__dirname, `../src/${config.sprite[sprite]}`);
        if (!fs.existsSync(imageDir)) {
            errors.push(`config.sprite["${sprite}"] => image dir does not exist, path=${imageDir}`);
        } else if (!fs.statSync(imageDir).isDirectory()) {
            errors.push(`config.sprite["${sprite}"] => image dir is not a directory, path=${imageDir}`);
        } else {
            const images = glob.sync("**/*.png", {cwd: imageDir});
            if (images.length === 0) {
                errors.push(`config.sprite["${sprite}"] => image dir does not contain png images, path=${imageDir}`);
            }
        }
    });
}


function validateSys(env, config) {
    if (config.sys === undefined) return;

    assertFileExists(`../conf/${env}/${config.sys}`, "config.sys");
}

export const validate = (env, config, production) => {
    const usedLib = new Set();

    validatePages(config, usedLib);
    validateLib(config, usedLib);
    validateSprite(config);

    if (production) {
        validateSys(env, config);
    }

    if (errors.length > 0) {
        console.error("validation failed, please fix the following errors");
        errors.forEach(error => {
            console.error("    ", error);
        });
        console.log();
        process.exit(1);
    }
};
