import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const jobs = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/jobs' }),
  schema: z.object({
    title: z.string(),
    department: z.enum([
      'social-media-content',
      'paid-media-performance',
      'video-production',
      'design-creative',
      'client-services',
      'operations',
    ]),
    location: z.enum(['durban', 'hybrid', 'remote']),
    employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
    status: z.enum(['open', 'closed']).default('open'),
    summary: z.string(),
    description: z.string(),
  }),
});

const missionLogs = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/mission-logs' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    type: z.string(),
    year: z.string(),
    desc: z.string(),
    tags: z.array(z.string()).default([]),
    img: z.string(),
    featured: z.boolean().default(false),
    wide: z.boolean().default(false),
    challenge: z.string(),
    solution: z.string(),
    results: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    gallery: z.array(z.string()).default([]),
  }),
});

export const collections = {
  jobs,
  'mission-logs': missionLogs,
};
