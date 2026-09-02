import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'sethsticle',
      name: 'mindloop-astro',
    },
    branchPrefix: 'draft/',
  },

  ui: {
    brand: {
      name: 'MLD Marketing Solutions',
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
            { label: 'Durban, KZN (in-office)', value: 'durban' },
            { label: 'Hybrid', value: 'hybrid' },
            { label: 'Remote', value: 'remote' },
          ],
          defaultValue: 'durban',
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

    missionLogs: collection({
      label: 'Mission Logs',
      slugField: 'title',
      path: 'src/content/mission-logs/*',
      format: 'yaml',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        client: fields.text({ label: 'Client' }),
        type: fields.text({ label: 'Service Type', description: 'e.g. "Social Media & Video Content"' }),
        year: fields.text({ label: 'Year', description: 'e.g. "Ongoing" or "2026"' }),
        desc: fields.text({ label: 'Short Description', multiline: true }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        img: fields.url({
          label: 'Cover Image URL',
          description: 'Hosted image URL - paste a client photo or stock image link.',
        }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        wide: fields.checkbox({ label: 'Wide Card', defaultValue: false }),
        challenge: fields.text({ label: 'The Brief', multiline: true }),
        solution: fields.text({ label: 'Our Approach', multiline: true }),
        results: fields.array(
          fields.object({
            value: fields.text({ label: 'Value', description: 'e.g. "42%" or "TBD"' }),
            label: fields.text({ label: 'Label' }),
          }),
          { label: 'Results', itemLabel: (props) => `${props.fields.value.value} — ${props.fields.label.value}` }
        ),
        gallery: fields.array(
          fields.url({ label: 'Image URL' }),
          { label: 'Gallery', itemLabel: (props) => props.value ?? 'Image' }
        ),
      },
    }),
  },
});
