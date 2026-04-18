import config from "@fourplusweb/eslint-config";

export default [
  ...config,
  {
    rules: {
      // FluidSection / other UI components use `role` as a semantic-padding
      // prop (e.g. role="hero"), not an ARIA role. jsx-a11y's aria-role rule
      // false-positives on these custom components.
      "jsx-a11y/aria-role": "off",
    },
  },
];
