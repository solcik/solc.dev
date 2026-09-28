module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  rules: {
    // Allow CSS Modules / Next conventions and BEM-ish names.
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'keyframes-name-pattern': null,
    // oklch(0.7 0.2 285) reads better than oklch(70% 0.2 285deg).
    'lightness-notation': null,
    'hue-degree-notation': null,
  },
};
