import {build} from "./webpack/webpack.builder";

export default () => {
    const config = {
        lib: {
            "react": ["react-dom", "react-redux", "react-router-dom", "redux-saga", "react-router-redux"],
            "polyfill": ["@babel/polyfill"],
            "net": ["axios"]
        },
        pages: {
            "index": {
                js: "app/index.jsx",
                template: "app/index.html"
            },
            "error": {
                js: "app/error.jsx",
                template: "app/error.html"
            }
        },
        sys: "sys.json"
    };

    return build(config);
};
