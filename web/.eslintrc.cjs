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
        'no-alert': 'off',
        'no-await-in-loop': 'off',
        '@typescript-eslint/no-loop-func': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
    },
    root: true,
    extends: [
        'airbnb',
        'airbnb-typescript',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
};
