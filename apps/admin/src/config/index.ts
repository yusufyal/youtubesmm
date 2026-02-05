// Site Configuration
export const siteConfig = {
  name: 'AYN YouTube',
  description: 'Premium YouTube growth services - Views, Subscribers, Watch Time, and more',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ayn.yt',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/aynyoutube',
    instagram: 'https://instagram.com/aynyoutube',
  },
  contact: {
    email: 'support@ayn.yt',
    whatsapp: '+965XXXXXXXX',
  },
};

// API Configuration
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
};

// Payment Configuration
export const paymentConfig = {
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  },
  tap: {
    publishableKey: process.env.NEXT_PUBLIC_TAP_PUBLISHABLE_KEY || '',
  },
  currency: 'USD',
  currencySymbol: '$',
};

// YouTube URL Validation Patterns
export const youtubePatterns = {
  video: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\S*)?$/,
  channel: /^(https?:\/\/)?(www\.)?youtube\.com\/(channel\/UC[\w-]{22}|c\/[\w-]+|@[\w-]+|user\/[\w-]+)\/?$/,
  playlist: /^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=([\w-]+)$/,
};

// Service Types Configuration
export const serviceTypes = {
  views: {
    label: 'YouTube Views',
    icon: 'eye',
    targetLabel: 'Video URL',
    targetPlaceholder: 'https://youtube.com/watch?v=...',
    pattern: youtubePatterns.video,
  },
  subscribers: {
    label: 'YouTube Subscribers',
    icon: 'users',
    targetLabel: 'Channel URL',
    targetPlaceholder: 'https://youtube.com/@channel',
    pattern: youtubePatterns.channel,
  },
  watch_time: {
    label: 'YouTube Watch Time',
    icon: 'clock',
    targetLabel: 'Video URL',
    targetPlaceholder: 'https://youtube.com/watch?v=...',
    pattern: youtubePatterns.video,
  },
  comments: {
    label: 'YouTube Comments',
    icon: 'message-circle',
    targetLabel: 'Video URL',
    targetPlaceholder: 'https://youtube.com/watch?v=...',
    pattern: youtubePatterns.video,
  },
  likes: {
    label: 'YouTube Likes',
    icon: 'thumbs-up',
    targetLabel: 'Video URL',
    targetPlaceholder: 'https://youtube.com/watch?v=...',
    pattern: youtubePatterns.video,
  },
  shares: {
    label: 'YouTube Shares',
    icon: 'share-2',
    targetLabel: 'Video URL',
    targetPlaceholder: 'https://youtube.com/watch?v=...',
    pattern: youtubePatterns.video,
  },
};

// Order Status Configuration
export const orderStatusConfig = {
  pending: { label: 'Pending', color: 'yellow', description: 'Awaiting payment' },
  processing: { label: 'Processing', color: 'blue', description: 'Order is being processed' },
  in_progress: { label: 'In Progress', color: 'indigo', description: 'Delivery in progress' },
  completed: { label: 'Completed', color: 'green', description: 'Order completed successfully' },
  partial: { label: 'Partial', color: 'orange', description: 'Partially delivered' },
  canceled: { label: 'Canceled', color: 'gray', description: 'Order was canceled' },
  refunded: { label: 'Refunded', color: 'red', description: 'Payment refunded' },
};

// SEO Configuration
export const seoConfig = {
  titleTemplate: '%s | AYN YouTube',
  defaultTitle: 'AYN YouTube - Premium YouTube Growth Services',
  defaultDescription: 'Boost your YouTube presence with premium views, subscribers, watch time, and engagement services. Fast delivery, real results, 24/7 support.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AYN YouTube',
  },
  twitter: {
    handle: '@aynyoutube',
    site: '@aynyoutube',
    cardType: 'summary_large_image',
  },
};

// Pagination defaults
export const paginationConfig = {
  defaultPerPage: 12,
  maxPerPage: 100,
};

// Rate limiting (for client-side throttling)
export const rateLimitConfig = {
  checkout: {
    maxRequests: 10,
    windowMs: 60000, // 1 minute
  },
};
