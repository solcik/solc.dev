/* eslint-disable global-require, no-nested-ternary, import/no-unresolved, import/no-extraneous-dependencies */
const { PHASE_PRODUCTION_SERVER } = require('next/constants');

module.exports = phase => {
    if (phase === PHASE_PRODUCTION_SERVER) {
        return {};
    }

    const withCSS = require('@zeit/next-css');

    return {
        target: 'serverless',
        ...withCSS({
            webpack(config) {
                config.module.rules.push({
                    test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            fallback: 'file-loader',
                            limit: 100000,
                            name: '[name].[ext]',
                        },
                    },
                });

                return config;
            },
        }),
    };
};
