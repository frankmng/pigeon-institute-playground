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

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    coreSystems: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      systems: z.array(z.object({
        title: z.string(),
        description: z.string(),
      })).length(5),
    }),
  }),
});

export const collections = { pages, updates };
