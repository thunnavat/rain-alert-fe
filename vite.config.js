import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import pluginRewriteAll from 'vite-plugin-rewrite-all';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), pluginRewriteAll()],
  base: "/tt3",
  dev: {
    proxyTable: {
      '/forget-password/*.*': { // this will match all urls with dots after '/t/'
        target: 'http://localhost:8080/',  // send to webpack dev server
        router: function (req) {
          req.url = 'index.html'  // Send to vue app
        }
      }
      // Any other routes you need to bypass should go here.
    }
    },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
