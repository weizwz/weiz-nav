import { dirname } from 'path';
import { fileURLToPath } from 'url';
import nextConfig from 'eslint-config-next/core-web-vitals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...nextConfig,
  {
    rules: {
      '@next/next/no-img-element': 'off',
      // React Compiler rules — only relevant when React Compiler is enabled.
      // Disabled until the project opts in to the compiler.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
    },
  },
];

export default config;
