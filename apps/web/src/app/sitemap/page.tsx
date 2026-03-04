import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sitemap',
  description:
    'Browse the full sitemap of Growmediafans. Find all pages including services, blog, company info, and legal pages in one place.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://growmediafans.com'}/sitemap`,
  },
};

const sitemapSections = [
  {
    title: 'Main',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
    ],
  },
  {
    title: 'Services',
    links: [
      { name: 'Buy YouTube Views', href: '/services/youtube-views' },
      { name: 'Buy YouTube Subscribers', href: '/services/youtube-subscribers' },
      { name: 'Buy YouTube Watch Time', href: '/services/youtube-watch-time' },
      { name: 'Buy YouTube Likes', href: '/services/youtube-likes' },
      { name: 'Buy YouTube Comments', href: '/services/youtube-comments' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Sitemap', href: '/sitemap' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Refund Policy', href: '/refund-policy' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <section className="bg-gradient-to-b from-red-50 to-white py-16 dark:from-red-950/20 dark:to-background min-h-[60vh]">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Sitemap
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A complete overview of all pages on Growmediafans.
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          {sitemapSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-neon-pink transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
