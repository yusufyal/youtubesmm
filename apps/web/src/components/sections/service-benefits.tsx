'use client';

import { motion } from 'framer-motion';
import {
  Eye,
  TrendingUp,
  Shield,
  Zap,
  Rocket,
  Lock,
  Users,
  Clock,
  MessageCircle,
  Award,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { GlowCard } from '@/components/cards/glow-card';

interface ServiceBenefitsProps {
  serviceType: string;
  serviceName: string;
  colors: {
    gradient: string;
    glow: string;
    bg: string;
  };
}

interface Benefit {
  icon: React.ElementType;
  title: string;
  description: string;
  highlight?: string;
}

const getBenefitsForService = (serviceType: string, serviceName: string): Benefit[] => {
  const baseBenefits: Record<string, Benefit[]> = {
    views: [
      {
        icon: Eye,
        title: 'Increased Visibility',
        description: `When you buy YouTube views, your videos appear more prominently in search results and recommended sections. Higher view counts signal to YouTube's algorithm that your content is worth watching, leading to even more organic exposure. This creates a powerful snowball effect that can transform your channel's reach.`,
        highlight: '10x more exposure',
      },
      {
        icon: TrendingUp,
        title: 'Algorithm Boost',
        description: `YouTube's recommendation algorithm heavily weighs view counts when deciding which videos to promote. By increasing your view count, you're essentially telling YouTube that your content is engaging and valuable. This leads to better placement in search results, suggested videos, and the coveted homepage recommendations.`,
        highlight: 'Better rankings',
      },
      {
        icon: Shield,
        title: 'Trust & Credibility',
        description: `Videos with higher view counts instantly appear more trustworthy to new viewers. People are naturally drawn to popular content - it's social proof in action. When someone sees thousands of views on your video, they're more likely to click, watch, and engage because others have validated the content.`,
        highlight: 'Social proof',
      },
      {
        icon: Rocket,
        title: 'Faster Channel Growth',
        description: `Starting a YouTube channel from zero is challenging. Buying views gives you the initial momentum needed to kickstart your growth journey. Once you have a solid view count, organic viewers are more likely to subscribe, share, and engage with your content, accelerating your path to monetization.`,
        highlight: 'Jumpstart growth',
      },
      {
        icon: Lock,
        title: 'Safe & Secure',
        description: `Our YouTube views are delivered through safe, platform-compliant methods that protect your channel. We never ask for your password, and our gradual delivery system mimics natural viewing patterns. Your channel's security and standing are our top priority - we've helped thousands of creators without a single account issue.`,
        highlight: '100% safe',
      },
      {
        icon: Award,
        title: 'Quality Guaranteed',
        description: `Unlike low-quality providers, we deliver real, high-retention views that actually benefit your channel. Each view comes with watch time that signals genuine engagement to YouTube. Plus, our refill guarantee means if any views drop, we'll replace them free of charge within 30 days.`,
        highlight: 'Refill guarantee',
      },
    ],
    subscribers: [
      {
        icon: Users,
        title: 'Grow Your Community',
        description: `Subscribers are the lifeblood of any successful YouTube channel. When you buy subscribers, you're building a foundation of followers who will see your content first. This creates a loyal audience base that helps every new video gain immediate traction and visibility.`,
        highlight: 'Build your base',
      },
      {
        icon: TrendingUp,
        title: 'Unlock Monetization',
        description: `YouTube requires 1,000 subscribers to join the Partner Program and start earning revenue. Buying subscribers can help you reach this milestone faster, opening the door to ad revenue, memberships, and super chats. Start earning from your passion sooner with a subscriber boost.`,
        highlight: 'Earn faster',
      },
      {
        icon: Shield,
        title: 'Establish Authority',
        description: `A high subscriber count positions you as an authority in your niche. When potential viewers see thousands of subscribers, they perceive your channel as established and trustworthy. This social proof makes them more likely to subscribe themselves, creating a powerful growth cycle.`,
        highlight: 'Look established',
      },
      {
        icon: Rocket,
        title: 'Boost Every Video',
        description: `More subscribers mean more immediate views on every video you publish. YouTube notifies your subscribers when you upload, giving each video a strong launch. This initial engagement boost signals to the algorithm that your content is valuable, leading to broader recommendations.`,
        highlight: 'Better launches',
      },
      {
        icon: Lock,
        title: 'Secure Growth',
        description: `Our subscriber delivery is designed with your channel's safety in mind. We use organic-looking growth patterns that don't trigger red flags. No password required, no suspicious activity - just steady, natural-looking subscriber growth that keeps your channel in good standing.`,
        highlight: 'No risk',
      },
      {
        icon: Award,
        title: 'Real Accounts',
        description: `We deliver subscribers from real accounts with profile pictures and activity history. These aren't empty bot accounts - they're genuine profiles that make your subscriber count look authentic. Plus, our retention guarantee ensures your numbers stay strong.`,
        highlight: 'Quality assured',
      },
    ],
    watch_time: [
      {
        icon: Clock,
        title: 'Meet Monetization Requirements',
        description: `YouTube requires 4,000 watch hours in the past 12 months for monetization. Buying watch time helps you reach this threshold faster, so you can start earning from ads, memberships, and more. Don't let the watch time requirement hold back your channel's potential.`,
        highlight: '4,000 hours goal',
      },
      {
        icon: TrendingUp,
        title: 'Improve Video Rankings',
        description: `Watch time is YouTube's most important ranking factor. Videos with higher watch time get promoted more in search and recommendations. By increasing your watch time, you're directly improving your videos' chances of reaching new audiences organically.`,
        highlight: '#1 ranking factor',
      },
      {
        icon: Shield,
        title: 'High Retention Views',
        description: `Our watch time service delivers high-retention views that actually watch your content. This sends strong engagement signals to YouTube's algorithm, showing that viewers find your content valuable enough to watch through. Better retention means better rankings.`,
        highlight: 'Real engagement',
      },
      {
        icon: Rocket,
        title: 'Accelerate Growth',
        description: `Building watch time organically can take years. Our service compresses that timeline, giving your channel the momentum it needs to grow faster. Use that extra time to focus on creating great content while we help you meet YouTube's requirements.`,
        highlight: 'Save time',
      },
      {
        icon: Lock,
        title: 'Safe Delivery',
        description: `We deliver watch time gradually through natural viewing patterns. Our system spreads views over time and varies watch durations to appear organic. Your channel stays safe, and your watch time stays counted. We've never had a client lose their progress.`,
        highlight: 'Protected hours',
      },
      {
        icon: Award,
        title: 'Guaranteed Hours',
        description: `Every hour of watch time we deliver is guaranteed to count toward your monetization goal. We track delivery in real-time and ensure you receive exactly what you ordered. If anything falls short, our support team will make it right immediately.`,
        highlight: 'Every hour counts',
      },
    ],
    comments: [
      {
        icon: MessageCircle,
        title: 'Boost Engagement',
        description: `Comments are one of the strongest engagement signals on YouTube. Videos with active comment sections get promoted more by the algorithm. Buying comments jumpstarts conversations that encourage organic viewers to join in, creating genuine community interaction.`,
        highlight: 'Start conversations',
      },
      {
        icon: TrendingUp,
        title: 'Algorithm Favorite',
        description: `YouTube's algorithm loves videos that generate discussion. Comments signal that your content resonates with viewers and sparks reactions. More comments lead to better recommendations, which leads to more views and even more organic comments.`,
        highlight: 'Get recommended',
      },
      {
        icon: Shield,
        title: 'Build Social Proof',
        description: `A video with many comments appears more popular and trustworthy. New viewers are more likely to watch, like, and subscribe when they see an active comment section. This social proof transforms casual viewers into engaged community members.`,
        highlight: 'Look popular',
      },
      {
        icon: Rocket,
        title: 'Spark Discussions',
        description: `Our comments are designed to spark genuine discussions. We use relevant, engaging comments that encourage others to reply and share their thoughts. This creates authentic-looking conversations that make your content appear viral and discussable.`,
        highlight: 'Real conversations',
      },
      {
        icon: Lock,
        title: 'Safe & Natural',
        description: `All comments come from aged accounts with natural activity patterns. We never use bot-generated or spammy comments that could harm your channel. Our gradual delivery ensures everything looks organic and keeps your channel in good standing.`,
        highlight: 'Quality accounts',
      },
      {
        icon: Award,
        title: 'Custom Options',
        description: `Choose from random relevant comments or provide your own custom comments. We can match your content's topic, tone, and audience. Plus, we offer options for positive, neutral, or question-based comments to suit your engagement strategy.`,
        highlight: 'Your choice',
      },
    ],
    default: [
      {
        icon: Eye,
        title: 'Increased Visibility',
        description: `Boost your content's visibility across the platform. Higher engagement metrics signal to algorithms that your content is worth promoting, leading to more organic reach and discovery by new audiences who are interested in your niche.`,
        highlight: 'More exposure',
      },
      {
        icon: TrendingUp,
        title: 'Algorithm Boost',
        description: `Social media algorithms favor content with strong engagement. By boosting your metrics, you're telling the platform that your content is valuable and should be shown to more users. This creates a positive feedback loop of growth.`,
        highlight: 'Better rankings',
      },
      {
        icon: Shield,
        title: 'Trust & Credibility',
        description: `High engagement numbers instantly make your content appear more trustworthy and popular. This social proof encourages new viewers to engage, follow, and share your content with their own networks.`,
        highlight: 'Social proof',
      },
      {
        icon: Rocket,
        title: 'Faster Growth',
        description: `Skip the slow initial growth phase and accelerate your journey to success. A boost in metrics gives you the momentum needed to attract organic engagement and build a genuine following faster.`,
        highlight: 'Quick results',
      },
      {
        icon: Lock,
        title: 'Safe & Secure',
        description: `Our services are delivered through safe, compliant methods that protect your account. We never require your password and use gradual delivery to ensure natural-looking growth that won't trigger any security concerns.`,
        highlight: '100% safe',
      },
      {
        icon: Award,
        title: 'Quality Guaranteed',
        description: `We deliver high-quality engagement from real accounts. Our refill guarantee ensures you always get what you paid for. If anything drops, we'll replace it free of charge within our guarantee period.`,
        highlight: 'Refill guarantee',
      },
    ],
  };

  return baseBenefits[serviceType] || baseBenefits.default;
};

export function ServiceBenefits({ serviceType, serviceName, colors }: ServiceBenefitsProps) {
  const benefits = getBenefitsForService(serviceType, serviceName);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 relative">
      {/* Section Header */}
      <ScrollReveal>
        <div className="text-center mb-16">
          <motion.span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${colors.gradient} text-white mb-4`}
            animate={{
              boxShadow: [
                `0 0 20px ${colors.glow}`,
                `0 0 40px ${colors.glow}`,
                `0 0 20px ${colors.glow}`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Why Buy {serviceName}
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Benefits of Buying{' '}
            <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
              {serviceName}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover why thousands of creators trust us to grow their channels. Our {serviceName.toLowerCase()} service
            delivers real results that help you succeed on YouTube.
          </p>
        </div>
      </ScrollReveal>

      {/* Benefits Grid */}
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {benefits.map((benefit, index) => (
          <motion.div key={benefit.title} variants={itemVariants}>
            <GlowCard className="h-full">
              <div className="p-6">
                {/* Icon */}
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={{
                      boxShadow: [
                        `0 0 10px ${colors.glow}`,
                        `0 0 20px ${colors.glow}`,
                        `0 0 10px ${colors.glow}`,
                      ],
                    }}
                    transition={{ boxShadow: { duration: 2, repeat: Infinity, delay: index * 0.2 } }}
                  >
                    <benefit.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    {benefit.highlight && (
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${colors.gradient} text-white`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {benefit.highlight}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <ScrollReveal delay={0.4}>
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Join over <span className="text-gray-900 font-semibold">1,000,000+</span> satisfied customers who have grown their channels with us
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon-pink" />
              <span className="text-sm text-gray-700">Instant Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700">100% Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-700">30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
