import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/paylater.ts',
      name: 'Paylater',
      formats: ['iife'],
      fileName: () => 'paylater.js',
    },
  },
});
