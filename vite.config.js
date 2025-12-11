import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from "path"; 
import { fileURLPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  alias: {
    '#components': resolve(dirname(fileURLPath(import.meta.url)),'components'),
    '#constants': resolve(dirname(fileURLPath(import.meta.url)),'constants'),
    '#store': resolve(dirname(fileURLPath(import.meta.url)),'store'),
    '#hoc': resolve(dirname(fileURLPath(import.meta.url)),'hoc'),
    '#windows': resolve(dirname(fileURLPath(import.meta.url)),'windows'),
  }
})
