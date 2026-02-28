import { Metadata } from 'next';
import api from '@/lib/api';
import { ServicesPageClient } from './services-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Premium YouTube Growth Services',
  description:
    'Browse premium YouTube growth services including views, subscribers, watch time, comments, and likes. Fast delivery, real results, and trusted support today.',
  openGraph: {
    title: 'YouTube Growth Services | AYN YouTube',
    description: 'Premium YouTube growth services with fast delivery and real results.',
  },
};

async function getServices() {
  try {
    return await api.getServices();
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  // Generate structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: service.name,
        description: service.short_description || service.description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${service.slug}`,
        offers: service.packages?.[0]
          ? {
              '@type': 'AggregateOffer',
              lowPrice: Math.min(...service.packages.map((p) => p.price)),
              highPrice: Math.max(...service.packages.map((p) => p.price)),
              priceCurrency: 'USD',
            }
          : undefined,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ServicesPageClient services={services} />
    </>
  );
}
