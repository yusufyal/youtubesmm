import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import api from '@/lib/api';
import { ServiceDetailClient } from './service-detail-client';

export const dynamic = 'force-dynamic';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

async function getService(slug: string) {
  try {
    return await api.getService(slug);
  } catch (error) {
    return null;
  }
}

// Service-specific SEO data
const serviceSEOData: Record<string, { title: string; description: string; keywords: string[] }> = {
  views: {
    title: 'Buy YouTube Views - 100% Real & Instant Delivery | Starting at $0.99',
    description: 'Buy real YouTube views with instant delivery. Safe, high-quality views from real users. No password required. 24/7 support. Money-back guarantee. Starting at just $0.99. Trusted by 1M+ creators.',
    keywords: ['buy youtube views', 'youtube views', 'real youtube views', 'cheap youtube views', 'instant youtube views', 'buy views for youtube'],
  },
  subscribers: {
    title: 'Buy YouTube Subscribers - Real & Active | Fast Delivery from $1.99',
    description: 'Buy real YouTube subscribers to grow your channel fast. High-quality, active subscribers. No password needed. Safe & secure. 30-day refill guarantee. Join 1M+ satisfied customers.',
    keywords: ['buy youtube subscribers', 'youtube subscribers', 'real youtube subscribers', 'cheap youtube subscribers', 'get youtube subscribers'],
  },
  watch_time: {
    title: 'Buy YouTube Watch Time Hours - Reach 4000 Hours Fast | Safe & Legit',
    description: 'Buy YouTube watch time hours to reach monetization requirements faster. High-retention watch hours that count. 100% safe method. No password required. Money-back guarantee.',
    keywords: ['buy youtube watch time', 'youtube watch hours', '4000 watch hours', 'youtube monetization', 'watch time hours'],
  },
  comments: {
    title: 'Buy YouTube Comments - Custom & Relevant | Boost Engagement Now',
    description: 'Buy YouTube comments to boost engagement and social proof. Custom or relevant comments from real accounts. Fast delivery. No password needed. 24/7 support available.',
    keywords: ['buy youtube comments', 'youtube comments', 'custom youtube comments', 'youtube engagement', 'video comments'],
  },
};

// FAQ data for schema markup
const getFAQs = (serviceType: string, serviceName: string) => {
  const baseFAQs = [
    {
      question: `Is it safe to buy YouTube ${serviceName.toLowerCase()}?`,
      answer: `Yes, buying ${serviceName.toLowerCase()} from AYN YouTube is completely safe. We use organic delivery methods that comply with YouTube's terms of service. We never use bots or fake accounts that could harm your channel. Our gradual delivery system mimics natural growth patterns, ensuring your channel remains in good standing.`,
    },
    {
      question: `Will I get banned for buying ${serviceName.toLowerCase()}?`,
      answer: `No, you will not get banned for using our service. We prioritize your channel's safety above all else. Our delivery methods are designed to appear completely natural to YouTube's algorithm. We've been in business for over 5 years and have never had a customer banned due to our services.`,
    },
    {
      question: 'Do you need my YouTube password?',
      answer: `Absolutely not! We will never ask for your password or any login credentials. All we need is the public URL of your YouTube video or channel. This keeps your account 100% secure.`,
    },
    {
      question: `How fast will I receive my ${serviceName.toLowerCase()}?`,
      answer: `Delivery typically begins within 5-30 minutes of your purchase. We use a gradual delivery system to ensure natural-looking growth. Smaller packages are usually completed within 24-48 hours, while larger packages may take several days to deliver fully.`,
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and various cryptocurrency options including Bitcoin and Ethereum. All payments are processed through secure, encrypted channels.',
    },
    {
      question: `What happens if my ${serviceName.toLowerCase()} drop?`,
      answer: `We offer a 30-day refill guarantee on all packages. If you experience any drop in your ${serviceName.toLowerCase()} count within 30 days of delivery completion, simply contact our support team and we'll refill them for free.`,
    },
    {
      question: 'Are the views/subscribers from real accounts?',
      answer: 'Yes! We only deliver from real accounts with genuine activity history. These are not bot accounts or fake profiles. Our network consists of real users who engage with content naturally.',
    },
    {
      question: 'Will this help my video rank better on YouTube?',
      answer: `Yes, increasing your ${serviceName.toLowerCase()} can positively impact your video's ranking. YouTube's algorithm considers engagement metrics when deciding which videos to recommend.`,
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes, we provide 24/7 customer support via live chat, email, and ticket system. Our support team is knowledgeable and responsive, typically answering queries within minutes.',
    },
    {
      question: 'Can I get a refund if I\'m not satisfied?',
      answer: 'Yes, we offer a money-back guarantee. If you\'re not satisfied with our service for any reason, contact our support team within 30 days of purchase for a full refund.',
    },
  ];

  return baseFAQs;
};

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  const seoData = serviceSEOData[service.type] || {
    title: `Buy ${service.name} - Premium Quality | AYN YouTube`,
    description: `Buy ${service.name} from AYN YouTube. High-quality, safe, and fast delivery. No password required. 24/7 support. Money-back guarantee.`,
    keywords: [`buy ${service.name.toLowerCase()}`, service.name.toLowerCase()],
  };

  const lowestPrice = service.packages?.[0]?.price;

  return {
    title: service.seo_title || seoData.title,
    description: service.meta_description || seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: service.seo_title || seoData.title,
      description: service.meta_description || seoData.description,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${service.slug}`,
      siteName: 'AYN YouTube',
      locale: 'en_US',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/og/${service.slug}.png`,
          width: 1200,
          height: 630,
          alt: `Buy ${service.name} - AYN YouTube`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.seo_title || seoData.title,
      description: service.meta_description || seoData.description,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${service.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(lowestPrice && {
      other: {
        'price': `$${lowestPrice}`,
        'availability': 'in stock',
      },
    }),
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aynyoutube.com';
  const lowestPrice = service.packages?.[0]?.price;
  const highestPrice = service.packages?.[service.packages.length - 1]?.price;

  // Generate Product structured data with AggregateOffer
  const productData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Buy ${service.name}`,
    description: service.description || `Premium ${service.name} for YouTube channels. Safe, fast, and reliable delivery.`,
    url: `${siteUrl}/services/${service.slug}`,
    brand: {
      '@type': 'Brand',
      name: 'AYN YouTube',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2847',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      offerCount: service.packages?.length || 1,
      offers: service.packages?.map((pkg) => ({
        '@type': 'Offer',
        name: pkg.name,
        price: pkg.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        seller: {
          '@type': 'Organization',
          name: 'AYN YouTube',
        },
      })),
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Sarah M.',
        },
        reviewBody: 'Exactly what I needed to kickstart my channel! The delivery was fast and everything looked natural.',
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Michael T.',
        },
        reviewBody: 'Best investment for my YouTube growth. Customer support was incredibly helpful.',
      },
    ],
  };

  // Generate BreadcrumbList structured data
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${siteUrl}/services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Buy ${service.name}`,
        item: `${siteUrl}/services/${service.slug}`,
      },
    ],
  };

  // Generate FAQPage structured data
  const faqs = getFAQs(service.type, service.name);
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Generate Organization structured data
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AYN YouTube',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/aynyoutube',
      'https://facebook.com/aynyoutube',
      'https://instagram.com/aynyoutube',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English'],
      areaServed: 'Worldwide',
    },
  };

  // Generate Service structured data
  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Buy ${service.name}`,
    description: service.description || `Premium ${service.name} service for YouTube creators`,
    provider: {
      '@type': 'Organization',
      name: 'AYN YouTube',
      url: siteUrl,
    },
    serviceType: 'Social Media Marketing',
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.name} Packages`,
      itemListElement: service.packages?.map((pkg) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: pkg.name,
        },
        price: pkg.price,
        priceCurrency: 'USD',
      })),
    },
  };

  return (
    <>
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
      
      <ServiceDetailClient service={service} />
    </>
  );
}
