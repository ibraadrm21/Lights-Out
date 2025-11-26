import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    root: '.',
    // We use the public/index.html as entry point if possible, or we move it.
    // Standard Vite expects index.html in root.
    // We will configure it to look at public/index.html but that's tricky.
    // Best bet: we will create a root index.html that imports src/main.jsx,
    // and we will leave public/index.html as requested by user (maybe for Flask serving).
    // Actually, for the build to work, we need index.html.
    // I'll just set root to '.' and expect index.html there.
    // I will write index.html to frontend/index.html AND frontend/public/index.html to be safe.
    build: {
        outDir: 'dist',
    }
})
