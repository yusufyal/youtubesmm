import { Metadata } from 'next';
import { Shield, Zap, Users, HeartHandshake, Award, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - AYN YouTube Growth Services',
  description:
    'Learn about AYN YouTube, a trusted platform helping creators grow their YouTube channels with premium services. Safe, reliable, and fast.',
  openGraph: {
    title: 'About Us | AYN YouTube',
    description: 'Trusted by 50,000+ creators worldwide. Premium YouTube growth services.',
  },
};

const values = [
  {
    icon: Shield,
    title: 'Safety First',
    description:
      'We use only organic, YouTube-compliant methods. Your channel safety is our top priority.',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description:
      'Most orders begin processing within minutes and complete within 24-72 hours.',
  },
  {
    icon: Users,
    title: 'Real Engagement',
    description:
      'All our services come from real users, ensuring genuine engagement and lasting results.',
  },
  {
    icon: HeartHandshake,
    title: '24/7 Support',
    description:
      'Our dedicated support team is available around the clock to help you with any questions.',
  },
  {
    icon: Award,
    title: 'Quality Guarantee',
    description:
      'We stand behind our services with a money-back guarantee and free refills for 30 days.',
  },
  {
    icon: Clock,
    title: '5+ Years Experience',
    description:
      'With over 5 years in the industry, we have the expertise to deliver consistent results.',
  },
];

const stats = [
  { value: '50,000+', label: 'Happy Customers' },
  { value: '1M+', label: 'Orders Delivered' },
  { value: '99.8%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Customer Support' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-red-50 to-white pt-28 pb-16 dark:from-red-950/20 dark:to-background">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About AYN YouTube
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We help YouTube creators grow their channels with premium, safe, and
            reliable growth services. Trusted by over 50,000 creators worldwide.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="prose max-w-none dark:prose-invert text-muted-foreground space-y-4">
            <p>
              AYN YouTube was founded with a simple mission: to help YouTube creators of
              all sizes achieve their growth goals. We understand the challenges of building
              a YouTube channel from scratch — the hours of content creation, the struggle
              for visibility, and the frustration of slow growth.
            </p>
            <p>
              That is why we built a platform that provides premium YouTube growth services
              that are safe, effective, and affordable. Whether you need views to boost your
              video rankings, subscribers to build your community, or watch time hours to
              reach monetization — we have got you covered.
            </p>
            <p>
              Over the past 5 years, we have helped more than 50,000 creators grow their
              channels. Our team of social media experts continuously refines our methods to
              ensure they comply with YouTube&apos;s guidelines while delivering real, lasting
              results.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/30">
        <div className="container max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground">
            To empower every YouTube creator with the tools and services they need to
            grow their channel, reach new audiences, and turn their passion into a
            profession. We believe that great content deserves to be seen, and we are
            here to make that happen.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container max-w-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Grow Your Channel?</h2>
          <p className="text-muted-foreground mb-6">
            Join over 50,000 creators who trust AYN YouTube for their channel growth.
          </p>
          <a
            href="/services"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-md hover:opacity-90 transition-opacity"
          >
            Browse Our Services
          </a>
        </div>
      </section>
    </>
  );
}
