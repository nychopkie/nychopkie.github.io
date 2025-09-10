import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/nychopkie.github.io/'
    : '/',
}
