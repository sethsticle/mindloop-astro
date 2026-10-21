// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mldmarketing.co.za', // required — Astro.site undefined writes a blank homepage shell
  output: 'static',
  adapter: cloudflare(),
  integrations: [react(), keystatic(), sitemap({ filter: (page) => !page.includes('/about-v2') })],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['node:async_hooks', '@keystatic/astro'],
    },
    optimizeDeps: {
      exclude: ['@keystatic/core', '@keystatic/astro'],
    },
  },
});
