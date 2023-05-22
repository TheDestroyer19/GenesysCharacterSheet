// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        watch: {
            ignored: [
                '**/src-tauri/target/debug/incremental/**'
            ]
        }
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                template: resolve(__dirname, 'template.html'),
            },
        },
    },
});