import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()).optional(),
    sources: z.array(z.string()).optional(),
    generated: z.boolean().optional(),
  }),
});

export const collections = { news };
