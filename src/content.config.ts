import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const updates = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/updates' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['Research', 'Field Notes', 'Announcement', 'Pigeon One']),
    summary: z.string(),
    heroImage: z.string(),
    gallery: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { updates };
