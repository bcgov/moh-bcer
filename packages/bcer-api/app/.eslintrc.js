module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/max-classes-per-file': 'off',
    // 'comma-dangle': ['error', {
    //   arrays: 'always-multiline',
    //   objects: 'always-multiline',
    //   imports: 'always-multiline',
    //   exports: 'always-multiline',
    //   functions: 'only-multiline',
    // }],
    // 'eol-last': ['error'],
    // 'object-curly-spacing': ['error'],
    'semi': ['error'],
  },
};
