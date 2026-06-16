import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Backend bilan bitta domen: /api va /uploads backendga proxy (dev).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
    },
  },
  build: { outDir: 'dist' },
});
