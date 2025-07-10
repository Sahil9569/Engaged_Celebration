import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';



import Prerender from 'vite-plugin-prerender';
import prerenderServer from './prerender-server.js';


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [  
        vue(),
        vuetify({
            autoImport: true,
            styles: { configFile: 'src/scss/variables.scss' }
        }),
        Prerender({
            // staticDir: 'dist', // folder where built files go
            staticDir: fileURLToPath(new URL('./dist', import.meta.url)),
            routes: [
                '/', "/about", "/customer", "/for-vendor", "/how-it-works", "/faq", "/contact", "/privacy-policy", // your SEO pages
            ],
            server: prerenderServer
        })
    ],
    resolve: {
        alias: {
             'lodash': 'lodash-es', 
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    },
    css: {
        preprocessorOptions: {
            scss: {}
        }
    },
    optimizeDeps: {
        exclude: ['vuetify'],
        entries: ['./src/**/*.vue']
    },
    build: {
        target: ['es2022', 'chrome99', 'firefox98', 'safari15']
    }
});


