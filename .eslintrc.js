module.exports = {
    extends: ['./configs/eslint/index.js'],
    overrides: [
      {
        files: ['*.config.ts'],
        rules: {
          'import/no-default-export': 'off',
        },
      },
    ],
  };