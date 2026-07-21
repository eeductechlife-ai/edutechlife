const js = require('@eslint/js');
const security = require('eslint-plugin-security');

module.exports = [
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    },
    plugins: {
      security,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...security.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-empty': 'warn',
      'no-undef': 'error',
    },
  },
];
