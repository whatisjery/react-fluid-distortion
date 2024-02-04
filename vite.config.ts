import { resolve } from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), glsl()],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: fileURLToPath(new URL('./src', import.meta.url)),
            },
        ],
    },
    build: {
        lib: {
            entry: resolve('src', 'index.ts'),
            name: 'ReactViteLibrary',
            formats: ['es', 'umd'],
            fileName: (format) => `react-vite-library.${format}.js`,
        },
    },
});
