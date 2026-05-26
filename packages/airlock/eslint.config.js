import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
    ...config,
    {
        files: ["**/*.ts"],
        rules: {
            // Airlock specific overrides
        }
    }
];
