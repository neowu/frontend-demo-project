import {build} from "./webpack/webpack.builder";

export default () => {
    const config = {
        lib: {
            "react": ["react-dom", "react-redux", "react-router-dom"],
            "net": ["axios"],
            "3rd": ["lib/3rd-party"]
        },
        pages: {
            "index": {
                js: "page/index/index.jsx",
                template: "page/index/index.html",
                lib: ["react", "3rd"]
            },
            "page1": {
                js: "page/page1/index.jsx",
                template: "page/page1/index.html",
                lib: ["react"]
            },
            "page2": {
                js: "page/page2/index.jsx",
                template: "page/page2/index.html",
                lib: ["react", "net"]
            },
            "page3": {
                js: "page/page3/index.jsx",
                template: "page/page3/index.html",
                lib: ["react"]
            }
        },
        sprite: {
            "sprite-icon1": "asset/sprite"
        },
        lint: {
            exclude: "legacy"
        },
        sys: "sys.json"
    };

    return build(config);
};
