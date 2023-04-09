module.exports = {
    extends: 'eslint:recommended',
    overrides: [
      {
        files: ['*.config.ts'],
        rules: {
          'import/no-default-export': 'off',
        },
      },
    ],
  };