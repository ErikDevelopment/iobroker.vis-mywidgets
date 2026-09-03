// Root ESLint flat config - covers test/ and tasks/.
// The widget sources under src-widgets/ use their own config (React/TSX specific),
// see src-widgets/eslint.config.mjs.
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['node_modules/**', 'src-widgets/**', 'widgets/**', 'admin/**'],
    },
    ...tseslint.configs.recommended,
    {
        files: ['test/**/*.ts', 'tasks/**/*.js'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
);
