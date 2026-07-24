import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // File-scoped rule overrides
  {
    files: ["src/components/la-blocks/CategoryGrid.tsx"],
    rules: {
      // aria-expanded={isOpen ? "true" : "false"} is semantically correct but
      // jsx-a11y/aria-proptypes cannot statically evaluate ternary expressions.
      "jsx-a11y/aria-proptypes": "off",
    },
  },
  {
    // Email templates are plain HTML rendered server-side for email clients.
    // They intentionally use inline styles (required for email client compatibility),
    // plain <head>, <img>, and <html> elements — Next.js rules do not apply here.
    files: ["src/lib/email/**"],
    rules: {
      "@next/next/no-head-element": "off",
      "@next/next/no-img-element": "off",
      "react/forbid-component-props": "off",
      "react/forbid-dom-props": "off",
    },
  },
]);

export default eslintConfig;
