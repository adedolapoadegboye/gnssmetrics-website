import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()).optional(),
    sources: z.array(z.string()).optional(),
    generated: z.boolean().optional(),
  }),
});

export const collections = { news };
