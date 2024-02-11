import path from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [react(), glsl(), dts({ include: 'lib' })],

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
            entry: path.resolve(__dirname, 'lib/index.ts'),
            name: 'fluid-distortion',
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom', '@react-three/fiber'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    '@react-three/fiber': 'reactThreeFiber',
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
        copyPublicDir: false,
    },
});
