import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages sirve el sitio en /pokedex-react/
  base: '/pokedex-react/',
  plugins: [react()],
});
