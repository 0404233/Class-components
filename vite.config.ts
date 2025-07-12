import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['data-view-buffer'], // exclude the problematic dependency
  },
  esbuild: {
    tsconfigRaw: {}, // prevent esbuild from loading tsconfig from node_modules
  },
});
