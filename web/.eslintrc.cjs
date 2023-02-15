module.exports = {
    parserOptions: {
        project: ['./tsconfig.json'],
    },
    root: true,
    extends: [
        'airbnb',
        'airbnb-typescript',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
};
