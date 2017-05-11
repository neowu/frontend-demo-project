const webpack = require("./webpack/webpack.lib");

module.exports = function (env) {
    const config = {
        lib: {
            "common": ["react", "react-dom"],
            "net": ["axios"]
        },
        pages: {
            "index": {js: "index.jsx", template: "index.html", dependencies: ["common"]},
            "page1/index": {js: "page/page1/index.jsx", template: "page/page1/index.html", dependencies: ["common"]},
            "page2/index": {
                js: "page/page2/index.jsx",
                template: "page/page2/index.html",
                dependencies: ["common", "net"]
            }
        }
    };

    return webpack(env, config);
};