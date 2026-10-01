// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
const { PUBLIC_WP_URL } = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: "https://astro.kurant.org.pl",
  image: {
    domains: [PUBLIC_WP_URL]
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],
  output: 'static',
  adapter: vercel()
});