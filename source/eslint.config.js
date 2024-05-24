import js from "@eslint/js";

export default [
    js.configs.recommended,

    {
        ignores: ["/*.js", "/docs/**/*.js"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                browser: true,
                node: true,
                es6: true,
            }
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
