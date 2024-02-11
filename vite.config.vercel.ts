/* eslint-disable no-undef */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    plugins: [react(), glsl()],
    root: path.resolve(__dirname, 'src'),
    build: {
        outDir: path.resolve(__dirname, 'dist_vercel'),
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/main.tsx'),
            },
            external: [
                '@/assets/github-mark-white.svg',
                '@/assets/decay.otf',
                '@/assets/abc-normal.ttf',
                '@/assets/img.jpg',
            ],
        },
    },
});
