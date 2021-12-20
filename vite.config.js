import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';

export default defineConfig({
    plugins: [
        eslintPlugin(),
        checker({
            eslint: {
                files: ['./'],
                extensions: ['.js'],
            },
        }),
    ],
});
