import webpack from "./webpack/webpack.builder";

export default (env) => {
    const config = {
        lib: {
            "common": ["react-dom", "react-redux", "react-router-dom"],
            "net": ["axios"],
            '3rd': ["lib/3rd-party"]
        },
        pages: {
            "index": {js: "page/index/index.jsx", template: "page/index/index.html", lib: ["common", "3rd"]},
            "page1": {js: "page/page1/index.jsx", template: "page/page1/index.html", lib: ["common"]},
            "page2": {
                js: "page/page2/index.jsx",
                template: "page/page2/index.html",
                lib: ["common", "net"]
            },
            "page3": {js: "page/page3/index.jsx", template: "page/page3/index.html", lib: ["common"]}
        },
        sprite: {
            "sprite-icon1": "asset/sprite"
        },
        lint: {
            exclude: "legacy"
        },
        sys: "sys.json"
    };

    return webpack(env, config);
};
