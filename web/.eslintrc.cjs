module.exports = {
    ignorePatterns: ['./dist/**/*.js', './coverage/**/*.js'],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'react/jsx-props-no-spreading': 'off',
        'jsx-a11y/label-has-associated-control': 'off',
        'jsx-a11y/anchor-is-valid': 0,
        "no-alert": "off",
    },
    root: true,
    extends: [
        'airbnb',
        'airbnb-typescript',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
};
