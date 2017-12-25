import {build} from "./webpack/webpack.builder";

export default () => {
    const config = {
        lib: {
            "react": ["react-dom", "react-redux", "react-router-dom", "redux-saga"],
            "net": ["axios"]
        },
        pages: {
            "index": {js: "app/pages/index/index.jsx", template: "app/pages/index/index.html", lib: ["react", "net"]},
            "error": {js: "app/pages/error/index.jsx", template: "app/pages/error/index.html", lib: ["react"]}
        },
        sys: "sys.json"
    };

    return build(config);
};
