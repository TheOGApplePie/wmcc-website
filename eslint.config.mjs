import sonarjs from "eslint-plugin-sonarjs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: [".next/**", "node_modules/**"] },
  {
    files: ["tests/**/*.cjs"],
    rules: {
      // The Node test harness intentionally loads CommonJS modules.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: [
      "src/lib/**/*.{ts,tsx}",
      "src/actions/events.ts",
      "src/app/schemas/events.ts",
      "src/app/events/**/*.tsx",
      "src/app/page.tsx",
      "src/components/calendar.tsx",
      "src/components/event*.tsx",
      "src/components/session*.tsx",
      "src/components/home*.tsx",
      "src/components/Carousel.tsx",
      "src/components/announcement*.tsx",
      "src/components/contentError.tsx",
      "src/components/missingEventSuggestions.tsx",
    ],
    plugins: { sonarjs },
    rules: {
      "sonarjs/cognitive-complexity": ["error", 15],
      "no-nested-ternary": "error",
      "jsx-a11y/prefer-tag-over-role": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-noninteractive-element-interactions": [
        "error",
        {
          handlers: [
            "onClick",
            "onMouseDown",
            "onMouseUp",
            "onKeyPress",
            "onKeyDown",
            "onKeyUp",
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
