module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    'cypress/globals': true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: [
    'airbnb',
    'plugin:vue/base',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:vue/strongly-recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'vue',
    'cypress',
  ],
  globals: {
    'ga': false, // Google Analytics
    'cordova': true,
    '__statics': true
  },
  // add your custom rules here
  'rules': {
    'indent': 0,
    'no-param-reassign': 0,
    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'no-unused-vars': 0,
    'import/no-extraneous-dependencies': 0,
    'prefer-destructuring': 0,
    'max-len': 0,
    'no-extend-native': 0,
    'func-names': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  }
};
