const webpack = require("./webpack/webpack.lib");

module.exports = (env) => {
	const config = {
		lib: {
			"common": [
				"react", "react-dom"
			],
			"net": ["axios"],
			'3rd': ["lib/3rd-party"]
		},
		pages: {
			"index": {
				js: "pages/index/index.jsx",
				template: "pages/index/index.html",
				dependencies: ["common", "3rd"]
			},
			"page1/index": {
				js: "pages/page1/index.jsx",
				template: "pages/page1/index.html",
				dependencies: ["common"]
			},
			"page2/index": {
				js: "pages/page2/index.jsx",
				template: "pages/page2/index.html",
				dependencies: ["common", "net"]
			},
			"demo/index": {
				js: "pages/demo/index.jsx",
				template: "pages/demo/index.html",
				dependencies: ["common"]
			}
		},
		sprite: {
			name: "sprite",
			path: "assets/sprite"
		}
	};

	return webpack(env, config);
};
