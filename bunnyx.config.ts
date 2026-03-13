import type { BunnyConfig } from 'bunnyx';

export default {
  // Elysia entry — exact format from `bun create elysia`
  server: './src/index.ts',
  bypass: ['openapi'],
  // BertUI config — same fields as bertui.config.js, passed through directly
  bertui: {
    baseUrl: 'http://localhost:3000',
    siteName: 'bunnyx-test',
    importhow: {
      
      // Add import aliases here — same as bertui importhow
      // components: './src/components',
      // ui: './src/components/ui',
    },
  meta: {
    title: 'BunnyX - The bridge for ElysiaJS and BERTUI',
    description: 'BunnyX connects ElysiaJS and BERTUI with zero abstraction, full type safety and pure React frontend',
    keywords: 'bunnyx, elysiajs, bertui, bun, react, typescript',
    ogTitle: 'BunnyX',
    ogDescription: 'The best bridge for ElysiaJS and BERTUI'
  }

  },

  dev:   { port: 3000 },
  build: { outDir: 'dist' },
} satisfies BunnyConfig;
