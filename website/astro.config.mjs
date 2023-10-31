import prefetch from '@astrojs/prefetch';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'drizzle-helpers',
      defaultLocale: 'root', // optional
      locales: {
        root: {
          label: 'English',
          lang: 'en', // lang is required for root locales
        },
      },
      social: {
        github: 'https://github.com/Enalmada/drizzle-helpers',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            {
              label: 'Getting Started',
              link: '/guides/getting-started/',
            },
            {
              label: 'Migration Script',
              link: '/guides/migration-script/',
            },
            {
              label: 'Optimized Connection',
              link: '/guides/optimized-connection/',
            },
            {
              label: 'ORM',
              link: '/guides/orm/',
            },
          ],
        },
        {
          label: 'Technologies',
          items: [
            {
              label: 'Summary',
              link: '/technologies/summary/',
            },
          ],
        },
      ],
    }),
    react(),
    // applyBaseStyles causes lists to not work anymore
    tailwind({
      applyBaseStyles: false,
    }),
    prefetch(),
  ],
});
