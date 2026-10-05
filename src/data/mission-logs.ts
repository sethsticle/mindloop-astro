/**
 * Mission log (case study) data - single source of truth for /portfolio and
 * /mission-logs/[slug]. Replaces the old Keystatic "Mission Logs" collection:
 * these change rarely, so they are edited here in code instead of via the CMS.
 *
 * Images live in public/assets/images/mission-logs/<slug>/ :
 *   img/header  - hero + portfolio card (wide, ~2.5:1)
 *   break       - full-width image under "The Brief" (~2:1)
 *   row         - 1 to 3 portrait (4:5) tiles under "Our Approach"; set span: 2
 *                 on a tile that is a double-width image (e.g. two posters in one file)
 */

/** One tile in the bottom image row. */
export interface RowImage {
  /** Public path to the image. */
  src: string;
  /** Grid columns this tile covers in the 3-column row. Defaults to 1. */
  span?: 1 | 2;
}

export interface MissionLog {
  /** URL slug: /mission-logs/<slug>. Must match the image folder name. */
  slug: string;
  /** Page title and card heading. */
  title: string;
  client: string;
  /** Service line shown on the card and detail page, e.g. "Social Media & Video Content". */
  type: string;
  /** "Ongoing" or a year. */
  year: string;
  /** Short description for cards and the meta description. */
  desc: string;
  tags: string[];
  /** Hero image on the detail page and cover on the portfolio card. */
  img: string;
  /** The first featured, non-hidden log becomes the large card on /portfolio. */
  featured?: boolean;
  /** Spans two columns in the portfolio works grid. */
  wide?: boolean;
  /** Archived: excluded from /portfolio, the detail route and "next" links until content is ready. */
  hidden?: boolean;
  /** "The Brief" copy. */
  challenge: string;
  /** "Our Approach" copy. */
  solution: string;
  /** Results stat cards. Leave empty to hide the section. */
  results: { value: string; label: string }[];
  /** Optional full-width image below "The Brief". Section hidden when omitted. */
  break?: string;
  /** Optional image row below "Our Approach". Section hidden when empty. */
  row: RowImage[];
}

export const missionLogs: MissionLog[] = [
  {
    slug: "alpine-volkswagen-hillcrest",
    title: "Alpine Volkswagen Hillcrest",
    client: "Alpine Volkswagen Hillcrest",
    type: "Social Media & Video Content",
    year: "Ongoing",
    desc: `Moving beyond traditional dealership marketing to content people genuinely want to engage with.`,
    tags: ["Social Media", "Video Content", "Automotive"],
    img: "/assets/images/mission-logs/alpine-volkswagen-hillcrest/header.webp",
    featured: false,
    challenge: `For Alpine Volkswagen Hillcrest, our focus was on moving beyond traditional dealership marketing and creating content that people genuinely want to engage with.`,
    solution: `By combining vibrant visuals, relatable video content and bold creative design, we developed a social media presence that showcases more than just vehicles - it highlights the people, experiences and lifestyle behind the brand. Every piece of content is designed to capture attention and encourage meaningful engagement. Our strategy balances dealership offers and vehicle features with authentic, personality-driven content that resonates with both existing customers and prospective buyers, helping Alpine Volkswagen Hillcrest stand out in a competitive market while building a stronger connection with its local community. The result is a dynamic social media presence that drives awareness, increases engagement and keeps the Alpine Volkswagen Hillcrest brand top-of-mind throughout the customer journey.`,
    results: [],
    break: "/assets/images/mission-logs/alpine-volkswagen-hillcrest/break.webp",
    row: [
      { src: "/assets/images/mission-logs/alpine-volkswagen-hillcrest/row-1.webp" },
      { src: "/assets/images/mission-logs/alpine-volkswagen-hillcrest/row-2.webp" },
      { src: "/assets/images/mission-logs/alpine-volkswagen-hillcrest/row-3.webp" },
    ],
  },
  {
    slug: "shell-whetstone-service-station",
    title: "Shell Whetstone Service Station",
    client: "Shell Whetstone Service Station",
    type: "Social Media & Brand Content",
    year: "Ongoing",
    desc: `Transforming a traditional service station into a destination brand people actively engage with online.`,
    tags: ["Social Media", "Brand Content", "Community"],
    img: "/assets/images/mission-logs/shell-whetstone-service-station/header.webp",
    featured: true,
    challenge: `For Shell Whetstone, our objective was to transform a traditional service station into a destination brand that people actively engage with online - rather than relying on generic fuel station content in a category with little standout social presence.`,
    solution: `We developed a creative direction inspired by retro advertising, bold colours and playful storytelling, designed to be instantly recognisable, scroll-stopping and memorable within a crowded social media landscape. By combining humour, local culture, community-focused messaging and eye-catching visuals, we created a social presence that feels less like a corporate fuel brand and more like a familiar part of everyday life - showcasing promotions, convenience offerings, staff personalities and customer experiences to build genuine connections with the local community. The result is a vibrant, engaging social media presence that drives brand awareness, encourages customer loyalty and keeps Shell Whetstone top-of-mind long after customers leave the forecourt.`,
    results: [],
    break: "/assets/images/mission-logs/shell-whetstone-service-station/break.webp",
    row: [
      { src: "/assets/images/mission-logs/shell-whetstone-service-station/row-1.webp" },
      { src: "/assets/images/mission-logs/shell-whetstone-service-station/row-2.webp" },
      { src: "/assets/images/mission-logs/shell-whetstone-service-station/row-3.webp" },
    ],
  },
  {
    slug: "green-power-motorsports",
    title: "Green Power Motorsports",
    client: "Green Power Motorsports",
    type: "Social Media & Motorsport Content",
    year: "Ongoing",
    desc: `Capturing the speed, intensity and innovation of modern motorsport, on and off the track.`,
    tags: ["Social Media", "Motorsport", "Sponsorship"],
    img: "/assets/images/mission-logs/green-power-motorsports/header.webp",
    featured: true,
    challenge: `For Green Power Motorsports, our goal was to capture the intensity, speed and innovation that define modern motorsport while building a brand identity that stands out both on and off the track.`,
    solution: `We developed a high-energy content strategy that combines dynamic race photography, bold graphic design, sponsor integration and compelling storytelling to keep fans engaged throughout the racing season. Every piece of content is designed to amplify the excitement of race weekends, celebrate key moments and showcase the team's journey as they compete at the highest level. Beyond race coverage, we focus on building a community around the brand by highlighting rider achievements, behind-the-scenes moments, partnerships and the innovative technologies powering the team's success - creating a deeper connection between the team, its supporters and its sponsors while maintaining a premium and professional image. The result is a fast-paced, visually striking social media presence that reflects the energy of the sport, strengthens brand recognition and positions Green Power Motorsports as a forward-thinking force within the motorsport industry.`,
    results: [],
    break: "/assets/images/mission-logs/green-power-motorsports/break.webp",
    row: [
      { src: "/assets/images/mission-logs/green-power-motorsports/row-1.webp", span: 2 },
      { src: "/assets/images/mission-logs/green-power-motorsports/row-2.webp" },
    ],
  },
  {
    slug: "hillcrest-guns-outdoor",
    title: "Hillcrest Guns & Outdoor",
    client: "Hillcrest Guns & Outdoor",
    type: "Social Media & Community Building",
    year: "Ongoing",
    desc: `Building authority, trust and community around a shared passion for the outdoor lifestyle.`,
    tags: ["Social Media", "Community", "Outdoor & Lifestyle"],
    img: "/assets/images/mission-logs/hillcrest-guns-outdoor/img.png",
    wide: false,
    challenge: `For Hillcrest Guns & Outdoor, our strategy was built around authority, trust and passion for the outdoor lifestyle. Operating within a highly specialised industry, it was important to create content that not only showcases products but also reinforces the brand's expertise and credibility.`,
    solution: `We developed a bold, high-impact visual style that reflects the precision, performance and professionalism associated with the firearms and outdoor market. Through a combination of striking product showcases, educational content, range updates, training promotions and engaging video content, we transformed the brand's social media presence into a valuable resource for both experienced enthusiasts and newcomers alike. Every post is designed to inform, engage and position Hillcrest Guns & Outdoor as a leading destination for firearms, outdoor equipment, training and shooting sports. The result is a powerful digital presence that strengthens brand recognition, builds customer confidence and fosters a loyal community around a shared passion for the outdoors.`,
    // Results hidden until MLD supplies real figures. Fill in and move into the array:
    //   { value: "", label: "growth in community trust metrics" },
    //   { value: "", label: "increase in training sign-ups" },
    //   { value: "", label: "audience growth" },
    //   { value: "", label: "content pieces delivered" },
    results: [],
    row: [
      { src: "/assets/images/mission-logs/hillcrest-guns-outdoor/row-1.webp" },
      { src: "/assets/images/mission-logs/hillcrest-guns-outdoor/row-2.webp" },
      { src: "/assets/images/mission-logs/hillcrest-guns-outdoor/row-3.webp" },
    ],
  },
  {
    slug: "mtn-cantel",
    title: "MTN Cantel",
    client: "MTN Cantel",
    type: "Social Media & Campaign Content",
    year: "Ongoing",
    desc: `Making mobile technology feel relevant, accessible and connected to everyday life.`,
    tags: ["Social Media", "Campaigns", "Telecommunications"],
    img: "/assets/images/mission-logs/mtn-cantel/img.jpg",
    hidden: true, // archived until MLD sends content
    challenge: `For MTN Cantel, our approach goes beyond promoting devices and mobile deals - we focus on creating content that feels relevant, engaging and connected to the audience's everyday lives. In a highly competitive telecommunications market, standing out requires more than product specifications.`,
    solution: `By combining premium product showcases, creative campaign concepts and culturally relevant content, we created a social media presence that resonates with local audiences while maintaining the professionalism expected from a leading technology retailer. Our content strategy leverages current trends, seasonal moments, community conversations and relatable digital experiences to make technology feel accessible and exciting - whether highlighting the latest smartphone features, showcasing customer experiences, or tapping into culturally relevant moments. The result is a vibrant and contemporary social media presence that strengthens brand awareness, increases customer interaction and positions MTN Cantel as more than just a mobile retailer - it's a brand that understands and connects with its community.`,
    // Results hidden until MLD supplies real figures. Fill in and move into the array:
    //   { value: "", label: "growth in customer interaction" },
    //   { value: "", label: "increase in campaign reach" },
    //   { value: "", label: "audience growth" },
    //   { value: "", label: "content pieces delivered" },
    results: [],
    break: "/assets/images/mission-logs/mtn-cantel/gallery/0.png",
    row: [],
  },
];
