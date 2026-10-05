import { createElement } from 'react';
import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'sethsticle',
      name: 'mindloop-astro',
    },
    // No branchPrefix - Keystatic commits straight to main. Saves publish
    // immediately once CI (or a manual `npm run deploy`) picks up the commit,
    // with no PR review gate in between. See PLAN.md NOTE to KB.
  },

  ui: {
    brand: {
      name: 'MLD Marketing Solutions',
      // Replaces Keystatic's default mark with the MLD helmet logo, swapping
      // to the black-text variant so it stays legible on Keystatic's light theme.
      mark: ({ colorScheme }) =>
        createElement('img', {
          src: colorScheme === 'dark' ? '/mld-logo.png' : '/mld-logo-light.png',
          alt: 'MLD',
          style: { height: '1.5rem', width: 'auto' },
        }),
    },
  },

  collections: {
    jobs: collection({
      label: 'Jobs',
      slugField: 'title',
      path: 'src/content/jobs/*',
      format: 'yaml',
      entryLayout: 'form',
      schema: {
        title: fields.slug({ name: { label: 'Job Title' } }),
        department: fields.select({
          label: 'Department',
          options: [
            { label: 'Social Media & Content', value: 'social-media-content' },
            { label: 'Paid Media & Performance', value: 'paid-media-performance' },
            { label: 'Video & Production', value: 'video-production' },
            { label: 'Design & Creative', value: 'design-creative' },
            { label: 'Client Services', value: 'client-services' },
            { label: 'Operations', value: 'operations' },
          ],
          defaultValue: 'social-media-content',
        }),
        location: fields.select({
          label: 'Location',
          options: [
            { label: 'Hillcrest, KZN (in office)', value: 'hillcrest' },
            { label: 'Hybrid', value: 'hybrid' },
            { label: 'Remote', value: 'remote' },
          ],
          defaultValue: 'hillcrest',
        }),
        employmentType: fields.select({
          label: 'Employment Type',
          options: [
            { label: 'Full-time', value: 'full-time' },
            { label: 'Part-time', value: 'part-time' },
            { label: 'Contract', value: 'contract' },
            { label: 'Internship', value: 'internship' },
          ],
          defaultValue: 'full-time',
        }),
        status: fields.select({
          label: 'Status',
          description: 'Closed jobs stay in the repo but drop off the public careers page and application dropdown.',
          options: [
            { label: 'Open', value: 'open' },
            { label: 'Closed', value: 'closed' },
          ],
          defaultValue: 'open',
        }),
        summary: fields.text({
          label: 'Short Summary',
          description: 'One or two sentences shown on the careers listing card.',
          multiline: true,
        }),
        description: fields.text({ label: 'Full Description', multiline: true }),
      },
    }),

    legends: collection({
      label: 'Local Legends',
      slugField: 'name',
      path: 'src/content/legends/*',
      format: 'yaml',
      entryLayout: 'form',
      schema: {
        name: fields.slug({ name: { label: 'Legend Name' } }),
        description: fields.text({
          label: 'One-line Description',
          description: 'What makes them a Legend - shown on their gallery card.',
        }),
        videoUrl: fields.url({
          label: 'Video URL',
          description: 'A YouTube or Vimeo link for now. Hosting approach may change once the final video count/length is known.',
        }),
        thumbnail: fields.image({
          label: 'Thumbnail',
          directory: 'public/assets/images/legends',
          publicPath: '/assets/images/legends/',
        }),
        order: fields.integer({
          label: 'Gallery Order',
          description: 'Lower numbers appear first.',
          defaultValue: 0,
        }),
      },
    }),
  },
});
