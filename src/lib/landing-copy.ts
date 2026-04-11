export const landingCopy = {
  hero: {
    badge: 'Built for Shopify, Etsy & small business sellers',
    headline: 'Stop wasting hours renaming product images.',
    subheadline:
      'Turn messy files like IMG_2045.jpg into clean, store-ready names in seconds.',
    bullets: [
      'Bulk rename hundreds of images instantly',
      'Built for Shopify, Etsy, and small business workflows',
      'No setup. No learning curve. Just upload and go',
    ],
    primaryCta: 'Try It Free — No Signup',
    secondaryCta: 'See How It Works',
    reinforcement: 'Free for up to 20 images. Upgrade only when you need more.',
  },

  problem: {
    heading: 'If your product images look like this…',
    messyFiles: [
      'IMG_2045.jpg',
      'DSC_0892.png',
      'photo (3).jpeg',
      '20240115_143022.jpg',
    ],
    painPoints: [
      'Renaming files one by one',
      'Losing track of which image is which',
      'Uploading messy assets to your store',
      'Wasting hours on manual work',
    ],
    punchline: "This isn't a \"you\" problem. It's a tooling problem.",
  },

  solution: {
    heading: 'AssetFlow fixes it in under 30 seconds.',
    body: 'Upload your images. Assign labels. Download perfectly named files.',
    reinforcement: 'No spreadsheets. No manual work. No headaches.',
  },

  howItWorks: {
    heading: 'How it works',
    subheading: 'From messy uploads to clean filenames in three simple steps.',
    steps: [
      {
        number: '01',
        title: 'Upload',
        description: 'Drag and drop your product images',
      },
      {
        number: '02',
        title: 'Label',
        description: 'Assign clear descriptors like front, angle, or zoom',
      },
      {
        number: '03',
        title: 'Download',
        description: 'Export perfectly named, store-ready files in one ZIP',
      },
    ],
  },

  features: {
    heading: 'Built for real workflows, not generic tools.',
    subheading: 'Everything you need to rename product images professionally',
    items: [
      {
        title: 'Smart Descriptor Locking',
        description: 'Never assign the same label twice by mistake',
      },
      {
        title: 'Instant Preview',
        description: 'See final filenames update in real time',
      },
      {
        title: 'Zero Learning Curve',
        description: 'If you can drag files, you can use AssetFlow',
      },
      {
        title: 'Actually Saves Time',
        description: 'Turn hours of repetitive work into minutes',
      },
      {
        title: 'Bulk Operations',
        description: 'Process hundreds of images in a single session',
      },
      {
        title: 'No Signup Required',
        description: 'Start using immediately — no account needed',
      },
    ],
  },

  audience: {
    heading: 'Perfect for teams of one.',
    subheading:
      'Whether you run a store, manage client assets, or upload product photos every week, AssetFlow keeps your files clean and consistent.',
    personas: [
      {
        title: 'Shopify store owners',
        description: 'Keep product listings organized and professional',
      },
      {
        title: 'Etsy sellers',
        description: 'Streamline your photo workflow for faster listings',
      },
      {
        title: 'Product photographers',
        description: 'Deliver clean, labeled assets to every client',
      },
      {
        title: 'Freelancers',
        description: 'Manage client assets without the manual headache',
      },
    ],
    reinforcement: 'If you deal with product images, this tool pays for itself fast.',
  },

  pricing: {
    heading: 'Start free. Upgrade when you need more.',
    subheading: 'Simple pricing that grows with you',
    reinforcement: 'Most users upgrade after their first batch.',
    tiers: {
      free: {
        name: 'Free',
        price: '$0',
        description: 'Free forever',
        features: [
          'Up to 20 images per session',
          'Full core workflow',
          'Drag-and-drop upload',
          'Live filename preview',
          'ZIP export',
          'No signup required',
        ],
        cta: 'Try It Free',
      },
      pro: {
        name: 'Pro',
        price: '$9',
        priceSubtext: '/month',
        description: 'Coming Soon',
        badge: 'Most Popular',
        features: [
          'Everything in Free',
          'Unlimited images',
          'Save naming templates',
          'Faster repeat workflows',
          'Access to future premium features',
        ],
        cta: 'Coming Soon',
      },
    },
  },

  finalCta: {
    heading: 'Stop renaming files manually.',
    subheading: 'Start organizing your product images the right way.',
    primaryCta: 'Try AssetFlow Free',
    secondaryCta: 'View Pricing',
  },
} as const
