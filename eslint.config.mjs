import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  eslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: [/\.config\.(ts|js|mjs)$/],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.dev.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "always",
          tsx: "always",
        },
      ],
    },
  },
);
