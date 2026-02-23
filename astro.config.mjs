// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://casa-maria-flora.com',
  
  // Server mode for API routes, pages prerender by default
  output: 'server',
  adapter: vercel({
    isr: true, // Enable Incremental Static Regeneration for better performance
  }),
  
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'nl'],
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'redirect'
    }
  },
  
  // Image optimization
  image: {
    // Use Sharp for image processing (WebP/AVIF)
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },

  // Build optimizations
  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
