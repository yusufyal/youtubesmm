import { Metadata } from 'next';
import api from '@/lib/api';

export const dynamic = 'force-dynamic';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Find answers to frequently asked questions about AYN YouTube services, payments, and delivery times. Get clear information and support in one place.',
  openGraph: {
    title: 'FAQ | AYN YouTube',
    description: 'Frequently asked questions about our YouTube growth services.',
  },
};

async function getFAQs() {
  try {
    return await api.getFAQs(true);
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    return [];
  }
}

export default async function FAQPage() {
  const faqGroups = await getFAQs();

  // Generate FAQ structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqGroups.flatMap((group) =>
      group.items.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white pt-28 pb-16 dark:from-red-950/20 dark:to-background">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Find answers to common questions about our services.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container max-w-3xl">
          {faqGroups.length > 0 ? (
            <div className="space-y-8">
              {faqGroups.map((group) => (
                <div key={group.category}>
                  <h2 className="mb-4 text-xl font-semibold">{group.category}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {group.items.map((faq) => (
                      <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>No FAQs available at the moment.</p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-12 rounded-lg bg-muted p-6 text-center">
            <h3 className="text-lg font-semibold">Still have questions?</h3>
            <p className="mt-2 text-muted-foreground">
              Can't find what you're looking for? Contact our support team.
            </p>
            <a
              href="/contact"
              className="mt-4 inline-block text-primary hover:underline"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
