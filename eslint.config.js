import config from "@fourplusweb/eslint-config";

export default [
  {
    ignores: [".next/**", ".claude/**", "next-env.d.ts"],
  },
  ...config,
  {
    rules: {
      // FluidSection / other UI components use `role` as a semantic-padding
      // prop (e.g. role="hero"), not an ARIA role. jsx-a11y's aria-role rule
      // false-positives on these custom components.
      "jsx-a11y/aria-role": "off",
    },
  },
  {
    // Node CLI scripts (build helpers, codegen, asset pipelines). Browser
    // globals like `window` are unavailable here; `console` / `process` are.
    files: ["scripts/**/*.{mjs,js}"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
];
