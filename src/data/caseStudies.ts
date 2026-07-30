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

// Result values below are placeholders (TBD) — the client's written brief covers
// objective/approach only, no numeric outcomes. Swap in real figures once supplied.
export const caseStudies: CaseStudy[] = [
  {
    slug: 'shell-whetstone-service-station',
    title: 'Shell Whetstone Service Station',
    client: 'Shell Whetstone Service Station',
    type: 'Social Media & Brand Content',
    year: 'Ongoing',
    desc: 'Transforming a traditional service station into a destination brand people actively engage with online.',
    tags: ['Social Media', 'Brand Content', 'Community'],
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&auto=format&q=80',
    challenge: 'For Shell Whetstone, our objective was to transform a traditional service station into a destination brand that people actively engage with online - rather than relying on generic fuel station content in a category with little standout social presence.',
    solution: 'We developed a creative direction inspired by retro advertising, bold colours and playful storytelling, designed to be instantly recognisable, scroll-stopping and memorable within a crowded social media landscape. By combining humour, local culture, community-focused messaging and eye-catching visuals, we created a social presence that feels less like a corporate fuel brand and more like a familiar part of everyday life - showcasing promotions, convenience offerings, staff personalities and customer experiences to build genuine connections with the local community. The result is a vibrant, engaging social media presence that drives brand awareness, encourages customer loyalty and keeps Shell Whetstone top-of-mind long after customers leave the forecourt.',
    results: [
      { value: 'TBD', label: 'growth in local engagement' },
      { value: 'TBD', label: 'increase in page reach' },
      { value: 'TBD', label: 'community follower growth' },
      { value: 'TBD', label: 'content pieces delivered' },
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
    slug: 'alpine-volkswagen-hillcrest',
    title: 'Alpine Volkswagen Hillcrest',
    client: 'Alpine Volkswagen Hillcrest',
    type: 'Social Media & Video Content',
    year: 'Ongoing',
    desc: 'Moving beyond traditional dealership marketing to content people genuinely want to engage with.',
    tags: ['Social Media', 'Video Content', 'Automotive'],
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&auto=format&q=80',
    challenge: 'For Alpine Volkswagen Hillcrest, our focus was on moving beyond traditional dealership marketing and creating content that people genuinely want to engage with.',
    solution: 'By combining vibrant visuals, relatable video content and bold creative design, we developed a social media presence that showcases more than just vehicles - it highlights the people, experiences and lifestyle behind the brand. Every piece of content is designed to capture attention and encourage meaningful engagement. Our strategy balances dealership offers and vehicle features with authentic, personality-driven content that resonates with both existing customers and prospective buyers, helping Alpine Volkswagen Hillcrest stand out in a competitive market while building a stronger connection with its local community. The result is a dynamic social media presence that drives awareness, increases engagement and keeps the Alpine Volkswagen Hillcrest brand top-of-mind throughout the customer journey.',
    results: [
      { value: 'TBD', label: 'growth in video engagement' },
      { value: 'TBD', label: 'increase in showroom enquiries' },
      { value: 'TBD', label: 'audience growth' },
      { value: 'TBD', label: 'content pieces delivered' },
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
    slug: 'hillcrest-guns-outdoor',
    title: 'Hillcrest Guns & Outdoor',
    client: 'Hillcrest Guns & Outdoor',
    type: 'Social Media & Community Building',
    year: 'Ongoing',
    desc: 'Building authority, trust and community around a shared passion for the outdoor lifestyle.',
    tags: ['Social Media', 'Community', 'Outdoor & Lifestyle'],
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&auto=format&q=80',
    challenge: 'For Hillcrest Guns & Outdoor, our strategy was built around authority, trust and passion for the outdoor lifestyle. Operating within a highly specialised industry, it was important to create content that not only showcases products but also reinforces the brand\'s expertise and credibility.',
    solution: 'We developed a bold, high-impact visual style that reflects the precision, performance and professionalism associated with the firearms and outdoor market. Through a combination of striking product showcases, educational content, range updates, training promotions and engaging video content, we transformed the brand\'s social media presence into a valuable resource for both experienced enthusiasts and newcomers alike. Every post is designed to inform, engage and position Hillcrest Guns & Outdoor as a leading destination for firearms, outdoor equipment, training and shooting sports. The result is a powerful digital presence that strengthens brand recognition, builds customer confidence and fosters a loyal community around a shared passion for the outdoors.',
    results: [
      { value: 'TBD', label: 'growth in community trust metrics' },
      { value: 'TBD', label: 'increase in training sign-ups' },
      { value: 'TBD', label: 'audience growth' },
      { value: 'TBD', label: 'content pieces delivered' },
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
    slug: 'mtn-cantel',
    title: 'MTN Cantel',
    client: 'MTN Cantel',
    type: 'Social Media & Campaign Content',
    year: 'Ongoing',
    desc: 'Making mobile technology feel relevant, accessible and connected to everyday life.',
    tags: ['Social Media', 'Campaigns', 'Telecommunications'],
    img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1400&auto=format&q=80',
    challenge: 'For MTN Cantel, our approach goes beyond promoting devices and mobile deals - we focus on creating content that feels relevant, engaging and connected to the audience\'s everyday lives. In a highly competitive telecommunications market, standing out requires more than product specifications.',
    solution: 'By combining premium product showcases, creative campaign concepts and culturally relevant content, we created a social media presence that resonates with local audiences while maintaining the professionalism expected from a leading technology retailer. Our content strategy leverages current trends, seasonal moments, community conversations and relatable digital experiences to make technology feel accessible and exciting - whether highlighting the latest smartphone features, showcasing customer experiences, or tapping into culturally relevant moments. The result is a vibrant and contemporary social media presence that strengthens brand awareness, increases customer interaction and positions MTN Cantel as more than just a mobile retailer - it\'s a brand that understands and connects with its community.',
    results: [
      { value: 'TBD', label: 'growth in customer interaction' },
      { value: 'TBD', label: 'increase in campaign reach' },
      { value: 'TBD', label: 'audience growth' },
      { value: 'TBD', label: 'content pieces delivered' },
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
    slug: 'green-power-motorsports',
    title: 'Green Power Motorsports',
    client: 'Green Power Motorsports',
    type: 'Social Media & Motorsport Content',
    year: 'Ongoing',
    desc: 'Capturing the speed, intensity and innovation of modern motorsport, on and off the track.',
    tags: ['Social Media', 'Motorsport', 'Sponsorship'],
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&auto=format&q=80',
    challenge: 'For Green Power Motorsports, our goal was to capture the intensity, speed and innovation that define modern motorsport while building a brand identity that stands out both on and off the track.',
    solution: 'We developed a high-energy content strategy that combines dynamic race photography, bold graphic design, sponsor integration and compelling storytelling to keep fans engaged throughout the racing season. Every piece of content is designed to amplify the excitement of race weekends, celebrate key moments and showcase the team\'s journey as they compete at the highest level. Beyond race coverage, we focus on building a community around the brand by highlighting rider achievements, behind-the-scenes moments, partnerships and the innovative technologies powering the team\'s success - creating a deeper connection between the team, its supporters and its sponsors while maintaining a premium and professional image. The result is a fast-paced, visually striking social media presence that reflects the energy of the sport, strengthens brand recognition and positions Green Power Motorsports as a forward-thinking force within the motorsport industry.',
    results: [
      { value: 'TBD', label: 'growth in race-weekend engagement' },
      { value: 'TBD', label: 'increase in sponsor visibility' },
      { value: 'TBD', label: 'audience growth' },
      { value: 'TBD', label: 'content pieces delivered' },
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
