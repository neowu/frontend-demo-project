import {build} from "./webpack/webpack.builder";

export default () => {
    const config = {
        lib: {
            "react": ["react-dom", "react-redux", "react-router-dom", "redux-saga"],
            "net": ["axios"]
        },
        pages: {
            "index": {js: "pages/index/index.jsx", template: "pages/index/index.html", lib: ["react", "net"]},
            "error": {js: "pages/error/index.jsx", template: "pages/error/index.html", lib: ["react"]}
        },
        sys: "sys.json"
    };

    return build(config);
};
