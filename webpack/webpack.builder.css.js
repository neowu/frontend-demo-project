import SpritesmithPlugin from "webpack-spritesmith";

import {webpackConfig} from "./webpack.builder";
import {resolve} from "./webpack.util";

export function configureSprite(config) {
    if (config.sprite === undefined) return;

    Object.keys(config.sprite).forEach(sprite => {
        const targetPNG = resolve(`build/generated/${sprite}.png`);
        const targetSCSS = resolve(`build/generated/${sprite}.scss`);

        webpackConfig.resolve.alias[`${sprite}.png`] = targetPNG;
        webpackConfig.resolve.alias[`${sprite}.scss`] = targetSCSS;
        webpackConfig.plugins.push(new SpritesmithPlugin({
            src: {
                cwd: resolve(`src/${config.sprite[sprite]}`),
                glob: "**/*.png"
            },
            target: {
                image: targetPNG,
                css: targetSCSS
            },
            apiOptions: {cssImageRef: `${sprite}.png`}
        }));
    });
}
