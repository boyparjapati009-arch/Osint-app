import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Fix: Replaced process.cwd() with path.resolve() to avoid a TypeScript type error where 'cwd' was not found on 'process'. path.resolve() without arguments returns the current working directory.
  const env = loadEnv(mode, path.resolve(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve('./'),
      },
    },
  };
});
