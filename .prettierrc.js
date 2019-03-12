module.exports = {
    printWidth: 80,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    jsxBracketSameLine: false,
    parser: 'babel',
    requirePragma: false,
    overrides: [
        { files: '*.json', options: { parser: 'json' } },
        { files: '*.css', options: { parser: 'css' } },
        { files: '*.scss', options: { parser: 'scss' } },
    ],
};
