// module.exports = {
// 	env: {
// 		browser: true,
// 		node: true,
// 		es6: true
// 	},
// 	extends: [ 'eslint:recommended', 'plugin:vue/essential' ],
// 	globals: {
// 		Atomics: 'readonly',
// 		SharedArrayBuffer: 'readonly',
// 		process: 'readonly',
// 		module: 'readonly',
// 		importScripts: 'readonly',
// 	},
// 	parserOptions: {
// 		parser: "babel-eslint", //to fix problem with keyword import e.g. catalogue.js line 5
// 		ecmaVersion: 2018,
// 		sourceType: 'module'
// 	},
// 	plugins: [ 'vue' ],
// 	// "rules": {
// 	//     "no-console": "warm"
// 	// }
// 	rules:{
// 		'no-console': 'off',
// 		"no-unused-vars": [2, { "argsIgnorePattern": "params||res||old_params||new_params"}],
// 		"no-prototype-builtins":'off',
// 		"no-mixed-spaces-and-tabs": 'off'
// 	}
// };

module.exports = {
  plugins: ["import"],
  root: true,
  env: {
    node: true,
    jest: true,
    es6: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // IMPORT
    "import/no-unresolved": "off",
    "import/named": "warn",
    "import/namespace": ["warn", { allowComputed: true }],
    "import/no-named-as-default": "off",
    "import/export": "warn",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "parent", "sibling", "index"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true
        }
      }
    ]
  }
};
