import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // .vite/manifest.json lets scripts/prerender.mjs add <link rel="modulepreload">
  // for each page's route chunk, so hydration never waits on a serial fetch.
  build: { manifest: true },
})
