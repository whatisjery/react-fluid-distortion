import { resolve } from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    publicDir: false,
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
            // eslint-disable-next-line no-undef
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Fluid distortion',
            fileName: 'fluid-distortion',
        },
    },
});
