module.exports = {
    ignorePatterns: ["./dist/**/*.js", "./coverage/**/*.js"],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    rules: {
        'react/jsx-props-no-spreading': 'off',
        'jsx-a11y/label-has-associated-control': 'off'
    },
    root: true,
    extends: [
        'airbnb',
        'airbnb-typescript',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
};
