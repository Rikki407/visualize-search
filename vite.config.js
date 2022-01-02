import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        eslintPlugin(),
        checker({
            eslint: {
                files: ['./'],
                extensions: ['.js'],
            },
        }),
        VitePWA({
            includeAssets: [
                'favicon.svg',
                'favicon.ico',
                'robots.txt',
                'apple-touch-icon.png',
            ],
            manifest: {
                name: 'AlgoSearch',
                short_name: 'AlgoSearch',
                description: 'An interactive playground to visualize various search algorithms like Breadth First, Depth First, Iterative Deepening, Greedy, Uniform Cost, A*, IDA*',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
        }),
    ],
});
