import { defineConfig } from 'tsup';
import { execSync } from 'child_process';

export default defineConfig({
  // Entry points for all exports
  entry: [
    'src/index.ts',
    'src/ui/index.ts',
    'src/utils/index.ts',
    'src/types/index.ts',
    'src/hooks/index.ts',
    'src/config/index.ts',
  ],

  // Output formats: ESM (.mjs) and CommonJS (.js)
  format: ['esm', 'cjs'],

  // Generate TypeScript declaration files
  dts: true,

  // Disable code splitting to preserve 'use client' directives
  splitting: false,

  // Clean dist folder before build
  clean: true,

  // Source maps for debugging
  sourcemap: true,

  // Minify output (disable for better debugging in dev)
  minify: false,

  // Keep directory structure
  outDir: 'dist',

  // External dependencies (don't bundle these)
  external: [
    'react',
    'react-dom',
    'next',
    // All peer dependencies should be external
  ],

  // Skip node_modules
  skipNodeModulesBundle: true,

  // Target ES2020 for modern browsers
  target: 'es2020',

  // Tree shake
  treeshake: true,

  // Keep names for better debugging
  keepNames: true,

  // Add 'use client' directive to all output files for Next.js App Router compatibility
  banner: {
    js: '"use client";',
  },

  // Run post-build script after each build (including watch mode)
  onSuccess: async () => {
    execSync('node scripts/add-use-client.mjs', { stdio: 'inherit' });
  },
});
