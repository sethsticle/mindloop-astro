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
    location: z.enum(['hillcrest', 'hybrid', 'remote']),
    employmentType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
    status: z.enum(['open', 'closed']).default('open'),
    summary: z.string(),
    description: z.string(),
  }),
});

const legends = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/legends' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    videoUrl: z.string(),
    thumbnail: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = {
  jobs,
  legends,
};
