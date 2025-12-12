import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: 'localhost',
        strictPort: false,
        hmr: {
            host: 'localhost',
            port: 5173
        },
        watch: {
            usePolling: false,
            ignored: ['**/node_modules/**', '**/.git/**']
        }
    },
    build: {
        cssMinify: false,
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]'
            }
        }
    }
})
