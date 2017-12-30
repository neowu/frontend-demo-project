/* eslint-env node */
/* eslint-disable no-console, no-process-exit, no-sync */
import fs from "fs";
import glob from "glob";

import {env, production, resolve} from "./webpack.util";

const errors = [];

function assertFileExists(relativePath, key) {
    const absolutePath = resolve(relativePath);
    if (!fs.existsSync(absolutePath)) {
        errors.push(`${key} => file does not exist, path=${absolutePath}`);
    }
}

function assertDirExists(relativePath, key) {
    const absolutePath = resolve(relativePath);
    if (!fs.existsSync(absolutePath)) {
        errors.push(`${key} => path does not exist, path=${absolutePath}`);
        return false;
    }
    if (!fs.statSync(absolutePath).isDirectory()) {
        errors.push(`${key} => path is not directory, path=${absolutePath}`);
        return false;
    }
    return true;
}

function validatePages(config) {
    Object.entries(config.pages).forEach(([name, page]) => {
        assertFileExists(`src/${page.js}`, `config.pages["${name}"].js`);
        assertFileExists(`src/${page.template}`, `config.pages["${name}"].template`);
    });
}

function validateSprite(config) {
    if (config.sprite === undefined) {
        return;
    }
    Object.entries(config.sprite).forEach(([name, sprite]) => {
        const dirExists = assertDirExists(`src/${sprite}`, `config.sprite["${name}"]`);
        if (dirExists) {
            const imageDir = resolve(`src/${sprite}`);
            const images = glob.sync("**/*.png", {cwd: imageDir});
            if (images.length === 0) {
                errors.push(`config.sprite["${name}"] => image dir does not contain any png image, path=${imageDir}`);
            }
        }
    });
}

function validateSys(config) {
    if (config.sys === undefined) return;

    assertFileExists(`conf/${env}/${config.sys}`, "config.sys");
}

function validateLint(config) {
    if (config.lint === undefined || config.lint.exclude === undefined) {
        return;
    }
    assertDirExists(`src/${config.lint.exclude}`, "config.lint.exclude");
}

export function validate(config) {
    validatePages(config);
    validateSprite(config);

    if (production) {
        validateSys(config);
        validateLint(config);
    }

    if (errors.length > 0) {
        console.error("validation failed, please fix the following errors:");
        errors.forEach((error) => {
            console.error("  ", error);
        });
        console.log();
        process.exit(1);
    }
}
