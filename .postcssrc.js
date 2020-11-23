module.exports = {
  plugins: {
    tailwindcss: { config: './.tailwindrc.js' },
    'postcss-preset-env': {
      stage: 1,
    },
    'postcss-dark-theme-class': {
      darkSelector: '.dark',
      lightSelector: '.light',
    },
    autoprefixer: {},
  },
};
