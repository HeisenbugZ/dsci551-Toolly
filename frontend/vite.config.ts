import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore
import svgPlugin from 'vite-plugin-fast-react-svg';
import tsconfigPaths from 'vite-tsconfig-paths';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgPlugin(),
  ],
});
