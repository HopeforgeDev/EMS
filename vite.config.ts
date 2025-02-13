import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

  optimizeDeps: {
    include: [
      '@schedule-x/calendar',
      'solid-js',
      'sqlite3'
    ]
  },
  build: {
    commonjsOptions: {
      esmExternals: true
    }
  }
  
});
