export const siteConfig = {
  name: 'My SaaS',
  description: 'A brief description of what this product does.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og.png',
  links: {
    twitter: 'https://twitter.com/yourusername',
    github: 'https://github.com/yourusername/your-repo',
  },
} as const;
