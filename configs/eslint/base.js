'use strict';

require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,

    parser: '@babel/eslint-parser',

    plugins: [],

    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jest: true,
        node: true,
    },

    settings: {},

    rules: {},

    ignorePatterns: [
        'node_modules/'
    ]
};