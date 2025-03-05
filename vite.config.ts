import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as process from 'process';

const enum BuildMode {
    PRODUCTION = 'production',
    DEVELOPMENT = 'development',
    MOCK = 'mock'
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return ({
        plugins: [
            react(),
            {
                name: 'add-script-tag',
                transformIndexHtml(html) {
                    return html.replace(
                        '</body>',
                        '<script type="module" src="/src/index.tsx"></script></body>',
                    );
                },
            },
        ],
        build: {
            outDir: 'dist',
            emptyOutDir: true,
        },
        server: {
            port: Number(env.VITE_PORT),
            proxy: {
                '/api': {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
        define: {
            __MOCK__: mode === BuildMode.MOCK,
        },
        resolve: {
            alias: {
                'shared': '/src/shared/',
                'widgets': '/src/widgets/',
                'pages': '/src/pages/',
                'app': '/src/app/',
            },
        },
    });
});
