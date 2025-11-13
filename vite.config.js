import { defineConfig } from 'vite';

// This configuration is essential for using environment variables on Vercel.
// It tells Vite to find the `API_KEY` variable during the build process
// and replace `process.env.API_KEY` in the code with its actual value.
// This allows for a single, consistent way to access the API key in the code
// that works both locally and in production.
export default defineConfig({
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});
