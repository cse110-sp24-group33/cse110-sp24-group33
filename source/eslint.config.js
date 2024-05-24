import js from "@eslint/js";

export default [
    js.configs.recommended,

    {
        "extends": "eslint:recommended",

        "ignorePatterns": ["/*.js", "/docs/**/*.js"],

        env: {
            browser: true,
            node: true,
            es6: true,
        },
        parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },

        rules: {
            "arrow-parens": ["error", "always"],
            "no-unused-vars": "warn",
            "no-undef": "warn",
            "indent": ["error", "tab"],
            "linebreak-style": ["off"],
            "quotes": ["error", "double"],
            "semi": ["error", "always"]
        }
    }
];
