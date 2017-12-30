import {build} from "./webpack/webpack.builder";

export default () => {
    const config = {
        lib: {
            "react": ["react-dom", "react-redux", "react-router-dom", "redux-saga", "babel-polyfill"],
            "net": ["axios"]
        },
        pages: {
            "index": {
                js: "app/pages/index.jsx",
                template: "app/pages/index.html"
            },
            "error": {
                js: "app/pages/error.jsx",
                template: "app/pages/error.html"
            }
        },
        sys: "sys.json"
    };

    return build(config);
};
