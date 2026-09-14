import eslintReact from '@eslint-react/eslint-plugin'
import eslintJs from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'
import pluginStart from '@tanstack/eslint-plugin-start'
import vitest from '@vitest/eslint-plugin'
import prettier from 'eslint-config-prettier/flat'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import importX from 'eslint-plugin-import-x'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import perfectionist from 'eslint-plugin-perfectionist'
import playwright from 'eslint-plugin-playwright'
import reactHooks from 'eslint-plugin-react-hooks'
import { configs as sonarjsConfigs } from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Import the named `configs` export (not the default plugin export) so the
// `recommended` config keeps its precise flat-config type instead of widening
// to `eslint-plugin-sonarjs`'s looser `ESLint.Plugin['configs']` union type.
const sonarjsRecommended = sonarjsConfigs.recommended

export default defineConfig([
  globalIgnores([
    'dist/**',
    '.output/**',
    '.nitro/**',
    '.tanstack/**',
    '.vercel/**',
    'node_modules/**',
    'src/routeTree.gen.ts',
    'playwright-report/**',
    'test-results/**',
    'coverage/**',
    '.docs/**',
    // vendored agent skills (installed by `npx impeccable install`)
    '.claude/skills/**',
    '.claude/agents/**',
  ]),

  // Core + TypeScript (type-aware)
  eslintJs.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: { allowDefaultProject: ['*.js', '*.mjs'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // React
  eslintReact.configs['recommended-type-checked'],
  reactHooks.configs.flat['recommended-latest'],
  jsxA11y.flatConfigs.strict,

  // TanStack
  pluginRouter.configs['flat/recommended'],
  pluginStart.configs['flat/recommended'],
  pluginQuery.configs['flat/recommended'],

  // Code quality
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  unicorn.configs.recommended,
  sonarjsRecommended,
  perfectionist.configs['recommended-natural'],

  {
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver({ project: './tsconfig.json' })],
    },
    rules: {
      // TypeScript
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports', prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true, varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/only-throw-error': [
        'error',
        {
          allow: [
            { from: 'package', name: 'Redirect', package: '@tanstack/router-core' },
            { from: 'package', name: 'NotFoundError', package: '@tanstack/router-core' },
          ],
          allowThrowingAny: false,
          allowThrowingUnknown: false,
        },
      ],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      // Imports
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-cycle': 'error',
      'import-x/no-default-export': 'error',
      'import-x/no-duplicates': ['error', { 'prefer-inline': true }],
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-unresolved': 'off', // TypeScript already reports unresolved imports

      // Core
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-restricted-syntax': [
        'error',
        {
          message: 'Use a union of string literals or an `as const` object instead of an enum.',
          selector: 'TSEnumDeclaration',
        },
        {
          message: 'Read environment variables through `env` from `#/env`.',
          selector: "MemberExpression[object.type='MetaProperty'][property.name='env']",
        },
        {
          message: 'Read environment variables through `env` from `#/env`.',
          selector: "MemberExpression[object.name='process'][property.name='env']",
        },
      ],

      // Unicorn: drop the rules that fight React / TypeScript idioms
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/name-replacements': [
        'error',
        {
          replacements: {
            args: false,
            env: false,
            params: false,
            props: false,
            ref: false,
            utils: false,
          },
        },
      ],
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/text-encoding-identifier-case': 'off', // HTML meta charSet must be "utf-8"

      // Sonar
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/deprecation': 'off', // duplicate of @typescript-eslint/no-deprecated
      'sonarjs/prefer-read-only-props': 'off',
      'sonarjs/todo-tag': 'off',

      // Perfectionist: sort imports/exports/unions, not object keys or JSX props.
      // Key sorting fights TanStack's property-order rule and hurts readability.
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-imports': ['error', { internalPattern: ['^#/.+'] }],
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-jsx-props': 'off',
      'perfectionist/sort-modules': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-switch-case': 'off',
    },
  },

  // TanStack file-based routes have their own naming ($param, _layout, __root, route.tsx)
  {
    files: ['src/routes/**/*.{ts,tsx}'],
    rules: { 'unicorn/filename-case': 'off' },
  },

  // shadcn/ui components stay close to upstream so re-generation is painless
  {
    files: ['src/components/ui/**/*.tsx'],
    rules: { 'sonarjs/no-nested-conditional': 'off' },
  },

  // Tool configs export a default by convention
  {
    files: ['*.config.{ts,js}'],
    rules: { 'import-x/no-default-export': 'off' },
  },

  // These files run outside the app and are the ones allowed to read
  // process.env / import.meta.env directly (env.ts defines the schema itself).
  {
    files: [
      'src/env.ts',
      '*.config.{ts,js}',
      'playwright.config.ts',
      'vitest.config.ts',
      'vite.config.ts',
    ],
    rules: { 'no-restricted-syntax': 'off' },
  },

  // Unit tests
  {
    ...vitest.configs.recommended,
    files: ['src/**/*.test.{ts,tsx}', 'src/test/**/*.ts'],
    rules: {
      ...vitest.configs.recommended.rules,
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'sonarjs/no-nested-functions': 'off',
    },
  },

  // End-to-end tests
  {
    ...playwright.configs['flat/recommended'],
    files: ['e2e/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'error',
    },
  },

  // Must be last: disables stylistic rules that conflict with Prettier
  prettier,
])
