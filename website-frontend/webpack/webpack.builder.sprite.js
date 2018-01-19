import SpritesmithPlugin from "webpack-spritesmith";

import {resolve} from "./webpack.util";
import {webpackConfig} from "./webpack.builder.conf";

export function configureSprite(config) {
    if (!config.sprite) return;

    Object.entries(config.sprite).forEach(([name, sprite]) => {
        const targetPNG = resolve(`build/sprite/${name}.png`);
        const targetLESS = resolve(`build/sprite/${name}.less`);

        webpackConfig.resolve.alias[`${name}.png`] = targetPNG;
        webpackConfig.resolve.alias[`${name}`] = targetLESS;
        webpackConfig.plugins.push(new SpritesmithPlugin({
            src: {
                cwd: resolve(`src/${sprite}`),
                glob: "**/*.png"
            },
            target: {
                image: targetPNG,
                css: targetLESS
            },
            apiOptions: {cssImageRef: `${name}.png`}
        }));
    });
}
