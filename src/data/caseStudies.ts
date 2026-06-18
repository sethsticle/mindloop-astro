export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  type: string;
  year: string;
  desc: string;
  tags: string[];
  img: string;
  challenge: string;
  solution: string;
  results: { value: string; label: string }[];
  gallery: [string, string, string];
  featured?: boolean;
  wide?: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'coastal-properties-brand',
    title: 'Coastal Properties Brand Refresh',
    client: 'Coastal Properties SA',
    type: 'Brand Identity & Digital',
    year: '2026',
    desc: 'A full digital identity overhaul for one of the Cape coast\'s longest-standing property firms - from logo to social presence.',
    tags: ['Brand', 'Social Media', 'Digital'],
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&auto=format&q=80',
    challenge: 'Coastal Properties had built a strong offline reputation over 18 years but their digital presence had not kept pace. Inconsistent branding across platforms, an outdated website, and near-zero social engagement meant potential buyers were finding competitors first. They needed a cohesive identity that could work across digital and print without a complete rebuild of their offline material.',
    solution: 'We began with a brand audit across all touchpoints before developing a refined visual identity that honoured the firm\'s heritage while modernising for digital. A structured social media calendar was rolled out across Instagram and Facebook, supported by targeted paid campaigns during peak listing periods. Monthly performance reports were introduced to keep the team aligned on what was working.',
    results: [
      { value: '4.1x', label: 'increase in social reach' },
      { value: '62%', label: 'more qualified enquiries' },
      { value: '3 months', label: 'to measurable ROI' },
      { value: '12K+', label: 'new followers gained' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1582407947304-fd86f28f4a32?w=900&auto=format&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&auto=format&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&q=80',
    ],
    featured: true,
    wide: false,
  },
  {
    slug: 'harvest-table-campaign',
    title: 'Harvest Table Campaign',
    client: 'Harvest Table Restaurant Group',
    type: 'Social Media & Content',
    year: '2026',
    desc: 'A seasonal campaign strategy that turned a local restaurant group into a destination dining brand.',
    tags: ['Social Media', 'Content', 'Campaign'],
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&auto=format&q=80',
    challenge: 'With three locations and a loyal but localised customer base, Harvest Table needed to expand their reach ahead of opening a fourth venue. Their existing social content was inconsistent and failed to capture the warmth and quality of the dining experience. Previous ad spend had not been tracked and there was no strategy connecting content to bookings.',
    solution: 'A 90-day content calendar was developed around seasonal produce themes, pairing photography direction, caption strategy and community engagement. Influencer partnerships were identified and managed, and paid social was used to target food-culture audiences within 25km of each location. A trackable reservation link was embedded across all profiles to tie content directly to bookings.',
    results: [
      { value: '220%', label: 'growth in Instagram followers' },
      { value: '8.4%', label: 'average engagement rate' },
      { value: '40%', label: 'increase in reservation bookings' },
      { value: 'R180K', label: 'in attributed revenue' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&q=80',
      'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=900&auto=format&q=80',
    ],
    featured: false,
    wide: false,
  },
  {
    slug: 'protek-digital-launch',
    title: 'Protek Digital Launch',
    client: 'Protek Security Systems',
    type: 'Digital Strategy & Advertising',
    year: '2025',
    desc: 'Taking a B2B security brand from zero digital presence to consistent inbound lead generation in under six months.',
    tags: ['Digital', 'Advertising', 'Strategy'],
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&auto=format&q=80',
    challenge: 'Protek relied entirely on word-of-mouth referrals. With increased competition in the commercial security space, they needed a scalable digital channel that could reliably generate qualified B2B leads - without an internal marketing team to manage it. Previous attempts at self-managed Google Ads had produced no trackable results and wasted budget.',
    solution: 'A lean digital stack was built from scratch: a LinkedIn presence for commercial trust-building, Google Ads campaigns targeting commercial property managers and estate developers, and a landing page funnel designed for lead capture. Monthly reporting was introduced tracking cost per lead and close rate, giving the sales team visibility over pipeline health for the first time.',
    results: [
      { value: '38', label: 'qualified leads in month one' },
      { value: 'R420', label: 'average cost per lead' },
      { value: '6x', label: 'pipeline growth in 90 days' },
      { value: '5', label: 'new enterprise contracts signed' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=900&auto=format&q=80',
    ],
    featured: false,
    wide: true,
  },
  {
    slug: 'maven-beauty-identity',
    title: 'Maven Beauty Identity',
    client: 'Maven Beauty Studio',
    type: 'Visual Identity & Social',
    year: '2025',
    desc: 'Building a cohesive brand world for an upmarket beauty studio across Instagram, packaging, and print.',
    tags: ['Brand', 'Social Media', 'Visual Identity'],
    img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1400&auto=format&q=80',
    challenge: 'Maven had strong word-of-mouth but their Instagram did not reflect the premium experience clients paid for. Inconsistent photography, clashing aesthetics, and no clear brand voice were preventing growth into the aspirational market segment they were targeting. New clients regularly mentioned they had hesitated because the social presence did not match the quality described in referrals.',
    solution: 'A full visual identity system was developed including colour palette, typography hierarchy, and a photography style guide. Content was produced in two-week sprints using the new system - a mix of educational posts, behind-the-scenes content, and promotional creative. A booking-link strategy drove direct enquiries through DMs, removing friction from the client journey.',
    results: [
      { value: '3x', label: 'profile visits month-on-month' },
      { value: '91%', label: 'booking capacity in 60 days' },
      { value: '18K', label: 'Instagram followers reached' },
      { value: '+45%', label: 'average service ticket size' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&auto=format&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&auto=format&q=80',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=900&auto=format&q=80',
    ],
    featured: false,
    wide: false,
  },
  {
    slug: 'edgeview-property-ads',
    title: 'Edgeview Property Ads',
    client: 'Edgeview Developments',
    type: 'Paid Social Advertising',
    year: '2024',
    desc: 'A targeted paid social strategy that sold out a 24-unit residential development three months ahead of schedule.',
    tags: ['Advertising', 'Social Media', 'Property'],
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&auto=format&q=80',
    challenge: 'With 18 units unsold six months before completion, Edgeview needed to accelerate sales without relying solely on estate agents. Their previous digital ad spend had produced minimal trackable results and the development team were sceptical of the channel. The brief was to demonstrate a clear, attributable return or not renew the engagement.',
    solution: 'A Facebook and Instagram campaign structure was built targeting first-time buyers and young professionals within a 15km radius, using layered interest and behavioural targeting. Three creative variants were tested simultaneously and budget was concentrated on the best-performing set within the first two weeks. A WhatsApp funnel captured and qualified leads before handoff to the sales team, reducing wasted agent time.',
    results: [
      { value: '18 units', label: 'sold in 11 weeks' },
      { value: 'R210', label: 'cost per qualified lead' },
      { value: '4.8x', label: 'return on ad spend' },
      { value: '3 months', label: 'ahead of sales target' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&auto=format&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&auto=format&q=80',
    ],
    featured: false,
    wide: false,
  },
];
