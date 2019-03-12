module.exports = {
    extends: [
        'airbnb',
        'prettier',
        'prettier/react',
        'plugin:import/errors',
        'plugin:import/warnings',
    ],
    parser: 'babel-eslint',
    plugins: ['prettier', 'import'],
    rules: {
        'prettier/prettier': 'error',
        'react/jsx-filename-extension': [
            1,
            {
                extensions: ['.js', '.jsx'],
            },
        ],
    },
    globals: {
        window: true,
    },
};
