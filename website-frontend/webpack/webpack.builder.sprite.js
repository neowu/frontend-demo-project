import SpritesmithPlugin from "webpack-spritesmith";

import {resolve} from "./webpack.util";
import {webpackConfig} from "./webpack.builder.conf";

export function configureSprite(config) {
    if (config.sprite === undefined) return;

    Object.keys(config.sprite).forEach((sprite) => {
        const targetPNG = resolve(`build/sprite/${sprite}.png`);
        const targetLESS = resolve(`build/sprite/${sprite}.less`);

        webpackConfig.resolve.alias[`${sprite}.png`] = targetPNG;
        webpackConfig.resolve.alias[`${sprite}`] = targetLESS;
        webpackConfig.plugins.push(new SpritesmithPlugin({
            src: {
                cwd: resolve(`src/${config.sprite[sprite]}`),
                glob: "**/*.png"
            },
            target: {
                image: targetPNG,
                css: targetLESS
            },
            apiOptions: {cssImageRef: `${sprite}.png`}
        }));
    });
}
