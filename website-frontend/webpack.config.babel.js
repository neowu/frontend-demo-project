import {build} from "./webpack/webpack.builder";

export default () => {
    const config = {
        lib: {
            "react": ["react-dom", "react-redux", "react-router-dom"],
            "net": ["axios"]
        },
        pages: {
            "index": {js: "page/index/index.jsx", template: "page/index/index.html", lib: ["react", "net"]},
            "error": {js: "page/error/index.jsx", template: "page/error/index.html", lib: ["react"]}
        },
        sys: "sys.json"
    };

    return build(config);
};
