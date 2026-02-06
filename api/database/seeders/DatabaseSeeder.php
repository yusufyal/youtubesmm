<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\FAQ;
use App\Models\Package;
use App\Models\Page;
use App\Models\Post;
use App\Models\Provider;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // === USERS (always idempotent) ===
        User::firstOrCreate(
            ['email' => 'admin@ayn.yt'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Test Customer',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'email_verified_at' => now(),
            ]
        );

        // === PROVIDER ===
        Provider::firstOrCreate(
            ['slug' => 'generic'],
            [
                'name' => 'Default SMM Provider',
                'api_url' => 'https://api.example-smm.com',
                'api_key' => 'your-api-key-here',
                'active' => true,
            ]
        );

        // === SERVICES & PACKAGES (only if none exist) ===
        if (Service::count() === 0) {
            $this->createServices();
        }

        // === PAGES (independent check) ===
        $this->createPages();

        // === FAQs (independent check) ===
        if (FAQ::count() === 0) {
            $this->createFAQs();
        }

        // === BLOG (independent check) ===
        $this->createBlogStructure();
        if (Post::count() === 0) {
            $this->createBlogPosts();
        }

        // === COUPON ===
        Coupon::firstOrCreate(
            ['code' => 'WELCOME10'],
            [
                'type' => 'percentage',
                'value' => 10,
                'active' => true,
            ]
        );

        // === SETTINGS ===
        $this->createSettings();
    }

    // ─────────────────────────────────────────────
    // SERVICES
    // ─────────────────────────────────────────────
    protected function createServices(): void
    {
        $services = [
            [
                'name' => 'YouTube Views',
                'slug' => 'youtube-views',
                'platform' => 'youtube',
                'type' => 'views',
                'description' => 'Boost your YouTube video with high-quality views. Our views come from real users and help improve your video\'s ranking and visibility.',
                'short_description' => 'Get more views on your YouTube videos',
                'seo_title' => 'Buy YouTube Views - Real & High Quality | AYN YouTube',
                'meta_description' => 'Buy YouTube views to boost your video rankings. Fast delivery, real views, and 24/7 support. Starting from $0.99.',
                'sort_order' => 1,
            ],
            [
                'name' => 'YouTube Subscribers',
                'slug' => 'youtube-subscribers',
                'platform' => 'youtube',
                'type' => 'subscribers',
                'description' => 'Grow your YouTube channel with real subscribers. Increase your channel authority and unlock more YouTube features.',
                'short_description' => 'Grow your channel with real subscribers',
                'seo_title' => 'Buy YouTube Subscribers - Real & Active | AYN YouTube',
                'meta_description' => 'Buy YouTube subscribers to grow your channel fast. 100% real subscribers, no drops, 24/7 support.',
                'sort_order' => 2,
            ],
            [
                'name' => 'YouTube Watch Time',
                'slug' => 'youtube-watch-time',
                'platform' => 'youtube',
                'type' => 'watch_time',
                'description' => 'Get more watch hours for your YouTube channel. Essential for YouTube monetization requirements (4000 hours).',
                'short_description' => 'Reach monetization faster with watch hours',
                'seo_title' => 'Buy YouTube Watch Time - 4000 Hours for Monetization',
                'meta_description' => 'Buy YouTube watch time to reach monetization requirements. Safe, fast delivery, and affordable prices.',
                'sort_order' => 3,
            ],
            [
                'name' => 'YouTube Comments',
                'slug' => 'youtube-comments',
                'platform' => 'youtube',
                'type' => 'comments',
                'description' => 'Get custom comments on your YouTube videos. Boost engagement and social proof with relevant comments.',
                'short_description' => 'Boost engagement with custom comments',
                'seo_title' => 'Buy YouTube Comments - Custom & Relevant',
                'meta_description' => 'Buy YouTube comments to boost your video engagement. Custom comments, fast delivery.',
                'sort_order' => 4,
            ],
            [
                'name' => 'YouTube Likes',
                'slug' => 'youtube-likes',
                'platform' => 'youtube',
                'type' => 'likes',
                'description' => 'Increase your video likes to improve social proof and engagement metrics.',
                'short_description' => 'More likes for better engagement',
                'seo_title' => 'Buy YouTube Likes - Fast & Affordable',
                'meta_description' => 'Buy YouTube likes at affordable prices. Fast delivery and real engagement.',
                'sort_order' => 5,
            ],
        ];

        foreach ($services as $serviceData) {
            $service = Service::firstOrCreate(
                ['slug' => $serviceData['slug']],
                $serviceData
            );
            if ($service->packages()->count() === 0) {
                $this->createPackagesForService($service);
            }
        }
    }

    protected function createPackagesForService(Service $service): void
    {
        $packages = match ($service->type) {
            'views' => [
                ['name' => 'Starter', 'quantity' => 1000, 'price' => 2.99, 'original_price' => 4.99],
                ['name' => 'Basic', 'quantity' => 5000, 'price' => 9.99, 'original_price' => 14.99],
                ['name' => 'Standard', 'quantity' => 10000, 'price' => 17.99, 'original_price' => 24.99],
                ['name' => 'Premium', 'quantity' => 50000, 'price' => 79.99, 'original_price' => 99.99],
                ['name' => 'Enterprise', 'quantity' => 100000, 'price' => 149.99, 'original_price' => 199.99],
            ],
            'subscribers' => [
                ['name' => 'Starter', 'quantity' => 100, 'price' => 4.99, 'original_price' => 7.99],
                ['name' => 'Basic', 'quantity' => 500, 'price' => 19.99, 'original_price' => 29.99],
                ['name' => 'Standard', 'quantity' => 1000, 'price' => 34.99, 'original_price' => 49.99],
                ['name' => 'Premium', 'quantity' => 5000, 'price' => 149.99, 'original_price' => 199.99],
            ],
            'watch_time' => [
                ['name' => 'Starter', 'quantity' => 500, 'price' => 29.99, 'original_price' => 39.99],
                ['name' => 'Basic', 'quantity' => 1000, 'price' => 49.99, 'original_price' => 69.99],
                ['name' => 'Standard', 'quantity' => 2000, 'price' => 89.99, 'original_price' => 119.99],
                ['name' => 'Monetization', 'quantity' => 4000, 'price' => 169.99, 'original_price' => 229.99],
            ],
            'comments' => [
                ['name' => 'Starter', 'quantity' => 10, 'price' => 4.99],
                ['name' => 'Basic', 'quantity' => 25, 'price' => 9.99],
                ['name' => 'Standard', 'quantity' => 50, 'price' => 17.99],
                ['name' => 'Premium', 'quantity' => 100, 'price' => 29.99],
            ],
            'likes' => [
                ['name' => 'Starter', 'quantity' => 500, 'price' => 2.99],
                ['name' => 'Basic', 'quantity' => 1000, 'price' => 4.99],
                ['name' => 'Standard', 'quantity' => 5000, 'price' => 19.99],
                ['name' => 'Premium', 'quantity' => 10000, 'price' => 34.99],
            ],
            default => [],
        };

        foreach ($packages as $index => $packageData) {
            Package::create([
                'service_id' => $service->id,
                'name' => $packageData['name'],
                'quantity' => $packageData['quantity'],
                'price' => $packageData['price'],
                'original_price' => $packageData['original_price'] ?? null,
                'estimated_time' => '24-72 hours',
                'min_quantity' => $packageData['quantity'],
                'max_quantity' => $packageData['quantity'] * 10,
                'refill_eligible' => in_array($service->type, ['views', 'subscribers', 'likes']),
                'refill_days' => 30,
                'sort_order' => $index,
                'features' => ['Real users', 'Gradual delivery', '24/7 support', 'Money-back guarantee'],
            ]);
        }
    }

    // ─────────────────────────────────────────────
    // PAGES (full content)
    // ─────────────────────────────────────────────
    protected function createPages(): void
    {
        $pages = [
            [
                'title' => 'About Us',
                'slug' => 'about-us',
                'seo_title' => 'About Us | AYN YouTube',
                'content' => $this->getAboutUsContent(),
            ],
            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy-policy',
                'seo_title' => 'Privacy Policy | AYN YouTube',
                'content' => $this->getPrivacyPolicyContent(),
            ],
            [
                'title' => 'Terms of Service',
                'slug' => 'terms-of-service',
                'seo_title' => 'Terms of Service | AYN YouTube',
                'content' => $this->getTermsOfServiceContent(),
            ],
            [
                'title' => 'Refund Policy',
                'slug' => 'refund-policy',
                'seo_title' => 'Refund Policy | AYN YouTube',
                'content' => $this->getRefundPolicyContent(),
            ],
        ];

        foreach ($pages as $pageData) {
            Page::updateOrCreate(
                ['slug' => $pageData['slug']],
                $pageData
            );
        }
    }

    protected function getAboutUsContent(): string
    {
        return '<h2>Who We Are</h2>
<p>AYN YouTube is a premier YouTube growth service trusted by over 50,000 creators worldwide. We specialize in helping content creators, businesses, and influencers grow their YouTube presence with safe, organic, and effective growth strategies.</p>

<h2>Our Mission</h2>
<p>Our mission is to empower YouTube creators of all sizes with the tools they need to succeed. We believe that great content deserves to be seen, and we are here to help you reach the audience your videos deserve.</p>

<h2>What We Offer</h2>
<ul>
<li><strong>YouTube Views</strong> — High-quality views from real users to boost your video rankings</li>
<li><strong>YouTube Subscribers</strong> — Grow your channel with genuine, active subscribers</li>
<li><strong>YouTube Watch Time</strong> — Reach the 4,000 hours needed for monetization</li>
<li><strong>YouTube Likes</strong> — Increase engagement and social proof on your videos</li>
<li><strong>YouTube Comments</strong> — Boost interaction with custom, relevant comments</li>
</ul>

<h2>Why Creators Trust Us</h2>
<ul>
<li><strong>100% Safe Methods</strong> — All our services comply with YouTube guidelines</li>
<li><strong>Real Engagement</strong> — We deliver real users, not bots</li>
<li><strong>Fast Delivery</strong> — Orders start within minutes and complete in 24-72 hours</li>
<li><strong>Money-Back Guarantee</strong> — Full refund if we do not deliver as promised</li>
<li><strong>24/7 Support</strong> — Our team is always available to help</li>
<li><strong>No Password Required</strong> — We never ask for your YouTube login credentials</li>
</ul>

<h2>Contact Us</h2>
<p>Have questions? Our support team is available 24/7. Reach us at <a href="mailto:support@ayn.yt">support@ayn.yt</a> or visit our <a href="/contact">Contact page</a>.</p>';
    }

    protected function getPrivacyPolicyContent(): string
    {
        return '<p><em>Last updated: January 1, 2026</em></p>

<h2>1. Introduction</h2>
<p>At AYN YouTube ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>

<h2>2. Information We Collect</h2>
<h3>Personal Information</h3>
<p>We may collect personally identifiable information that you voluntarily provide when you:</p>
<ul>
<li>Create an account (name, email address)</li>
<li>Place an order (payment information, YouTube video/channel URLs)</li>
<li>Contact our support team</li>
<li>Subscribe to our newsletter</li>
</ul>

<h3>Automatically Collected Information</h3>
<p>When you visit our website, we may automatically collect:</p>
<ul>
<li>IP address and browser type</li>
<li>Pages viewed and time spent on pages</li>
<li>Referring website addresses</li>
<li>Device and operating system information</li>
</ul>

<h2>3. How We Use Your Information</h2>
<p>We use the information we collect to:</p>
<ul>
<li>Process and fulfill your orders</li>
<li>Communicate with you about your orders and account</li>
<li>Improve our website and services</li>
<li>Send promotional communications (with your consent)</li>
<li>Prevent fraud and ensure security</li>
<li>Comply with legal obligations</li>
</ul>

<h2>4. Data Sharing</h2>
<p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
<ul>
<li><strong>Service Providers</strong> — Payment processors and delivery partners who help us operate our business</li>
<li><strong>Legal Requirements</strong> — When required by law or to protect our rights</li>
</ul>

<h2>5. Cookies</h2>
<p>We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser preferences. Essential cookies are required for the website to function properly.</p>

<h2>6. Data Security</h2>
<p>We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

<h2>7. Your Rights</h2>
<p>You have the right to:</p>
<ul>
<li>Access the personal data we hold about you</li>
<li>Request correction of inaccurate data</li>
<li>Request deletion of your personal data</li>
<li>Opt out of marketing communications</li>
<li>Export your data in a portable format</li>
</ul>

<h2>8. Data Retention</h2>
<p>We retain your personal data for as long as your account is active or as needed to provide services. Order records are kept for 2 years for accounting and legal purposes.</p>

<h2>9. Children\'s Privacy</h2>
<p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>

<h2>10. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>

<h2>11. Contact Us</h2>
<p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@ayn.yt">support@ayn.yt</a>.</p>';
    }

    protected function getTermsOfServiceContent(): string
    {
        return '<p><em>Last updated: January 1, 2026</em></p>

<h2>1. Acceptance of Terms</h2>
<p>By accessing or using AYN YouTube ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

<h2>2. Description of Service</h2>
<p>AYN YouTube provides social media marketing services for YouTube, including but not limited to views, subscribers, watch time, likes, and comments. We act as an intermediary connecting you with our network of service providers.</p>

<h2>3. Account Registration</h2>
<ul>
<li>You must provide accurate and complete information when creating an account</li>
<li>You are responsible for maintaining the confidentiality of your account credentials</li>
<li>You must be at least 18 years old to use our services</li>
<li>One account per person; duplicate accounts may be terminated</li>
</ul>

<h2>4. Orders and Payments</h2>
<ul>
<li>All prices are listed in US Dollars (USD)</li>
<li>Payment is required before order processing begins</li>
<li>We accept major credit cards and other payment methods as displayed at checkout</li>
<li>All sales are subject to our Refund Policy</li>
<li>We reserve the right to modify pricing at any time without prior notice</li>
</ul>

<h2>5. Service Delivery</h2>
<ul>
<li>Delivery times are estimates and may vary based on order size and demand</li>
<li>Most orders begin processing within 0-6 hours of payment confirmation</li>
<li>We are not responsible for delays caused by factors outside our control</li>
<li>Service counts may fluctuate slightly due to platform adjustments</li>
</ul>

<h2>6. Acceptable Use</h2>
<p>You agree NOT to:</p>
<ul>
<li>Use our services for any illegal or unauthorized purpose</li>
<li>Provide YouTube URLs that contain illegal, harmful, or copyrighted content</li>
<li>Attempt to reverse-engineer, hack, or disrupt our platform</li>
<li>Resell our services without written authorization</li>
<li>Submit fraudulent payment information</li>
</ul>

<h2>7. Refills and Guarantees</h2>
<ul>
<li>Eligible services include free refills for 30 days from the delivery date</li>
<li>Refill requests must be submitted through your dashboard or by contacting support</li>
<li>Refills apply only to drops; they do not cover content removal by YouTube</li>
</ul>

<h2>8. Intellectual Property</h2>
<p>All content on this website, including text, graphics, logos, and software, is the property of AYN YouTube and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.</p>

<h2>9. Limitation of Liability</h2>
<p>AYN YouTube shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount you paid for the specific service in question.</p>

<h2>10. Disclaimer</h2>
<p>Our services are provided "as is" without warranties of any kind. We do not guarantee specific results, YouTube rankings, or monetization outcomes. YouTube may change its policies at any time, which could affect service delivery.</p>

<h2>11. Termination</h2>
<p>We reserve the right to suspend or terminate your account at any time for violation of these terms, fraudulent activity, or any other reason at our discretion. Upon termination, pending orders may be canceled and refunded.</p>

<h2>12. Changes to Terms</h2>
<p>We may update these Terms of Service at any time. Continued use of our services after changes constitutes acceptance of the new terms. We encourage you to review this page periodically.</p>

<h2>13. Contact</h2>
<p>For questions about these Terms of Service, contact us at <a href="mailto:support@ayn.yt">support@ayn.yt</a>.</p>';
    }

    protected function getRefundPolicyContent(): string
    {
        return '<p><em>Last updated: January 1, 2026</em></p>

<h2>1. Our Guarantee</h2>
<p>At AYN YouTube, customer satisfaction is our top priority. We offer a comprehensive refund policy to ensure you are completely satisfied with our services.</p>

<h2>2. Eligibility for Refund</h2>
<p>You are eligible for a full or partial refund if:</p>
<ul>
<li><strong>Non-Delivery</strong> — Your order has not started within 72 hours of payment</li>
<li><strong>Incomplete Delivery</strong> — Less than 80% of the ordered quantity was delivered</li>
<li><strong>Wrong Service</strong> — You received a different service than what you ordered</li>
<li><strong>Technical Error</strong> — A duplicate charge or system error occurred</li>
</ul>

<h2>3. Non-Refundable Situations</h2>
<p>Refunds will NOT be issued in the following cases:</p>
<ul>
<li>The order has been fully delivered as described</li>
<li>Your YouTube video or channel was deleted or made private after placing the order</li>
<li>Natural fluctuations in counts (small drops of less than 10% are normal)</li>
<li>You changed the video URL after the order was placed</li>
<li>More than 30 days have passed since the order was completed</li>
</ul>

<h2>4. How to Request a Refund</h2>
<ol>
<li>Log in to your account and go to your <strong>Order Dashboard</strong></li>
<li>Find the order you want to refund and click <strong>Request Support</strong></li>
<li>Select "Refund Request" and provide details about the issue</li>
<li>Our team will review your request within 24 hours</li>
</ol>
<p>Alternatively, you can email us at <a href="mailto:support@ayn.yt">support@ayn.yt</a> with your order number and reason for the refund.</p>

<h2>5. Refund Processing</h2>
<ul>
<li>Approved refunds are processed within 3-5 business days</li>
<li>Refunds are issued to the original payment method</li>
<li>Partial refunds may be offered for partially completed orders</li>
<li>We may offer account credit as an alternative to a monetary refund</li>
</ul>

<h2>6. Refill Instead of Refund</h2>
<p>For services with a refill guarantee (views, subscribers, likes), we recommend requesting a free refill before a refund. Refills are processed within 24-48 hours and are available for 30 days after delivery.</p>

<h2>7. Chargebacks</h2>
<p>Please contact us before initiating a chargeback with your bank. We are committed to resolving any issues directly. Filing a chargeback without first contacting us may result in account suspension.</p>

<h2>8. Contact Us</h2>
<p>For refund inquiries, reach our support team at <a href="mailto:support@ayn.yt">support@ayn.yt</a>. We respond to all inquiries within 24 hours.</p>';
    }

    // ─────────────────────────────────────────────
    // FAQs (20+ questions)
    // ─────────────────────────────────────────────
    protected function createFAQs(): void
    {
        $faqs = [
            // General
            ['category' => 'General', 'question' => 'Is it safe to buy YouTube services?', 'answer' => 'Yes, our services are 100% safe. We use organic, YouTube-compliant methods that have been tested over 5+ years. We have served over 50,000 customers without any account bans or penalties.'],
            ['category' => 'General', 'question' => 'Do you need my YouTube password?', 'answer' => 'No, we never ask for your YouTube login credentials. All we need is the URL of the video or channel you want to promote. Your account security is always maintained.'],
            ['category' => 'General', 'question' => 'Will my account get banned?', 'answer' => 'No. We have never had a customer account banned due to our services. We use safe, gradual delivery methods that mimic organic growth patterns, keeping your channel fully compliant with YouTube policies.'],
            ['category' => 'General', 'question' => 'Are the views/subscribers real people?', 'answer' => 'Yes, all our services are delivered through real user accounts. We do not use bots or fake accounts. This ensures genuine engagement and lasting results for your channel.'],

            // Services
            ['category' => 'Services', 'question' => 'What services do you offer?', 'answer' => 'We offer a comprehensive range of YouTube growth services including: Views, Subscribers, Watch Time Hours, Likes, and Comments. Each service has multiple packages to suit different budgets and goals.'],
            ['category' => 'Services', 'question' => 'Can I buy YouTube watch time for monetization?', 'answer' => 'Yes! Our watch time service is specifically designed to help you reach the 4,000 watch hours required for YouTube monetization. We deliver high-retention watch hours that count towards your monetization threshold.'],
            ['category' => 'Services', 'question' => 'Can I split my order across multiple videos?', 'answer' => 'Yes, you can distribute your order across multiple video URLs during checkout. Simply add multiple links and specify how many views/likes you want for each video.'],
            ['category' => 'Services', 'question' => 'Do you offer custom packages?', 'answer' => 'Yes! If our standard packages do not meet your needs, contact our support team and we will create a custom package tailored to your specific requirements and budget.'],

            // Payment
            ['category' => 'Payment', 'question' => 'What payment methods do you accept?', 'answer' => 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and various digital payment methods through our secure payment gateway. All transactions are encrypted with SSL.'],
            ['category' => 'Payment', 'question' => 'Is my payment information secure?', 'answer' => 'Absolutely. All payments are processed through PCI-compliant, encrypted payment gateways. We never store your credit card details on our servers. Your financial information is completely safe.'],
            ['category' => 'Payment', 'question' => 'Do you offer any discounts?', 'answer' => 'Yes! We regularly offer promotional discounts and coupon codes. Check our website for current offers, or subscribe to our newsletter to receive exclusive deals. Larger packages also offer better per-unit pricing.'],

            // Orders & Delivery
            ['category' => 'Orders', 'question' => 'How long does delivery take?', 'answer' => 'Most orders start processing within 0-6 hours of payment confirmation. Delivery typically completes within 24-72 hours depending on the order size. Larger orders may take up to 5-7 days for gradual, natural-looking delivery.'],
            ['category' => 'Orders', 'question' => 'Can I track my order?', 'answer' => 'Yes! You can track your order status in real-time from your account dashboard. You will see the current progress, start count, and estimated completion time. We also send email notifications for order updates.'],
            ['category' => 'Orders', 'question' => 'What if I do not receive my order?', 'answer' => 'We offer a full money-back guarantee. If your order has not started within 72 hours, you are entitled to a complete refund. Contact our support team and we will resolve the issue immediately.'],
            ['category' => 'Orders', 'question' => 'Can I cancel my order?', 'answer' => 'You can request cancellation before the order starts processing. Once delivery has begun, cancellation is not possible, but you can request a partial refund for the undelivered portion. Contact support for assistance.'],

            // Refills & Guarantees
            ['category' => 'Refills', 'question' => 'Do you offer refills?', 'answer' => 'Yes, most of our services (views, subscribers, likes) come with a free 30-day refill guarantee. If you experience any drops during this period, simply submit a refill request and we will top up your count at no extra charge.'],
            ['category' => 'Refills', 'question' => 'How do I request a refill?', 'answer' => 'Log in to your account, go to your order history, and click the "Request Refill" button on the relevant order. Alternatively, contact our support team with your order number. Refills are usually processed within 24-48 hours.'],
            ['category' => 'Refills', 'question' => 'What is your refund policy?', 'answer' => 'We offer full refunds for non-delivered orders and partial refunds for incomplete deliveries. Refund requests must be submitted within 30 days of the order. Please see our full Refund Policy page for detailed terms.'],

            // Account
            ['category' => 'Account', 'question' => 'Do I need an account to place an order?', 'answer' => 'No, you can place orders as a guest using just your email address. However, creating an account gives you access to order tracking, refill requests, order history, and faster checkout for future purchases.'],
            ['category' => 'Account', 'question' => 'How do I create an account?', 'answer' => 'Click the "Get Started" button in the navigation menu or visit our registration page. You just need to provide your name, email address, and create a password. Verification is instant and you can start ordering right away.'],
            ['category' => 'Account', 'question' => 'I forgot my password. What should I do?', 'answer' => 'Click the "Forgot Password" link on the login page. Enter your email address and we will send you a password reset link. If you do not receive the email, check your spam folder or contact our support team.'],

            // Technical
            ['category' => 'Technical', 'question' => 'Will buying views affect my YouTube Analytics?', 'answer' => 'Our views appear as organic traffic in your YouTube Analytics. They come from real users across different devices and locations, so your analytics will show natural-looking traffic patterns.'],
            ['category' => 'Technical', 'question' => 'Do views help with YouTube SEO?', 'answer' => 'Yes! Higher view counts signal to YouTube that your content is popular, which can improve your video ranking in search results and recommendations. Combined with good content, purchased views can kickstart organic growth.'],
        ];

        foreach ($faqs as $index => $faqData) {
            FAQ::create([
                'question' => $faqData['question'],
                'answer' => $faqData['answer'],
                'category' => $faqData['category'],
                'sort_order' => $index,
                'active' => true,
            ]);
        }
    }

    // ─────────────────────────────────────────────
    // BLOG
    // ─────────────────────────────────────────────
    protected function createBlogStructure(): void
    {
        $categories = ['YouTube Growth', 'Monetization', 'Tips & Tricks', 'Industry News'];
        foreach ($categories as $index => $name) {
            Category::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'sort_order' => $index]
            );
        }

        $tags = ['YouTube', 'Growth', 'Subscribers', 'Views', 'Monetization', 'Tips', 'Algorithm', 'SEO'];
        foreach ($tags as $name) {
            Tag::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        }
    }

    protected function createBlogPosts(): void
    {
        $admin = User::where('email', 'admin@ayn.yt')->first();
        if (!$admin) return;

        $growthCategory = Category::where('slug', 'youtube-growth')->first();
        $monetizationCategory = Category::where('slug', 'monetization')->first();
        $tipsCategory = Category::where('slug', 'tips-tricks')->first();

        $posts = [
            [
                'title' => 'How to Grow Your YouTube Channel in 2026: The Complete Guide',
                'slug' => 'how-to-grow-youtube-channel-2026',
                'excerpt' => 'Discover proven strategies to grow your YouTube channel in 2026. From content optimization to audience engagement, learn everything you need to build a successful channel.',
                'category_id' => $growthCategory?->id,
                'seo_title' => 'How to Grow Your YouTube Channel in 2026 | Complete Guide',
                'meta_description' => 'Learn proven strategies to grow your YouTube channel in 2026. Expert tips on content creation, SEO, audience engagement, and monetization.',
                'content' => '<p>Growing a YouTube channel in 2026 requires a strategic approach that combines great content with smart promotion. Whether you are just starting out or looking to take your existing channel to the next level, this guide covers everything you need to know.</p>

<h2>1. Define Your Niche and Target Audience</h2>
<p>The most successful YouTube channels have a clear focus. Choose a niche that you are passionate about and that has an active audience. Research your competitors, identify gaps in content, and position yourself uniquely.</p>
<p>Use YouTube Analytics to understand your current audience demographics. This data helps you create content that resonates with viewers who are most likely to subscribe and engage.</p>

<h2>2. Optimize Your Content for YouTube SEO</h2>
<p>YouTube is the second-largest search engine in the world. Optimizing your videos for search is crucial for discoverability:</p>
<ul>
<li><strong>Keyword Research:</strong> Use tools like Google Trends and YouTube search suggestions to find popular keywords in your niche</li>
<li><strong>Title Optimization:</strong> Include your primary keyword naturally in the first 60 characters of your title</li>
<li><strong>Description:</strong> Write detailed descriptions (250+ words) with relevant keywords and timestamps</li>
<li><strong>Tags:</strong> Use a mix of broad and specific tags related to your content</li>
<li><strong>Thumbnails:</strong> Create eye-catching custom thumbnails with clear text and vibrant colors</li>
</ul>

<h2>3. Maintain a Consistent Upload Schedule</h2>
<p>Consistency is key on YouTube. Create a realistic upload schedule and stick to it. Whether it is once a week or three times a week, consistency helps build audience expectations and improves algorithmic favor.</p>

<h2>4. Engage With Your Community</h2>
<p>Building a community around your channel is essential for long-term growth. Respond to comments, create community posts, and consider hosting live streams. The more you engage, the more YouTube promotes your content.</p>

<h2>5. Leverage Social Media and Cross-Promotion</h2>
<p>Do not rely solely on YouTube for traffic. Share your videos on Twitter, Instagram, Reddit, and relevant Facebook groups. Create short clips for TikTok and Instagram Reels to drive traffic back to your full videos.</p>

<h2>6. Invest in Your Channel Growth</h2>
<p>Sometimes organic growth needs a boost. Services like buying YouTube views can help increase your video visibility, which leads to more organic discovery. When your videos have higher view counts, they appear more credible and attract more clicks from search results.</p>

<h2>Conclusion</h2>
<p>Growing a YouTube channel takes time, dedication, and strategy. By implementing these tips consistently, you will see steady growth in your subscriber count, views, and overall channel performance. Remember, every successful YouTuber started from zero.</p>',
            ],
            [
                'title' => 'YouTube Algorithm Explained: How Videos Get Recommended in 2026',
                'slug' => 'youtube-algorithm-explained-2026',
                'excerpt' => 'Understanding the YouTube algorithm is key to getting more views. Learn how YouTube decides which videos to recommend and how to optimize your content for maximum reach.',
                'category_id' => $tipsCategory?->id,
                'seo_title' => 'YouTube Algorithm Explained 2026 | How Videos Get Recommended',
                'meta_description' => 'Understand how the YouTube algorithm works in 2026. Learn what factors influence video recommendations and how to optimize your content.',
                'content' => '<p>The YouTube algorithm is a complex recommendation system that determines which videos appear in search results, suggested videos, and on the homepage. Understanding how it works is essential for any creator who wants to grow their channel.</p>

<h2>How the Algorithm Works</h2>
<p>YouTube\'s algorithm is driven by machine learning and focuses on two primary goals: helping viewers find videos they want to watch, and maximizing long-term viewer satisfaction.</p>

<h2>Key Ranking Factors</h2>

<h3>1. Watch Time and Retention</h3>
<p>Watch time is the single most important metric. YouTube prioritizes videos that keep viewers watching for longer periods. Average view duration and audience retention rate directly impact how often your video is recommended.</p>

<h3>2. Click-Through Rate (CTR)</h3>
<p>Your thumbnail and title determine whether people click on your video. A higher CTR signals to YouTube that your video is appealing. Aim for a CTR above 5% for search results and above 3% for browse features.</p>

<h3>3. Engagement Signals</h3>
<p>Likes, comments, shares, and subscribers gained from a video all tell YouTube that viewers find your content valuable. Encourage engagement by asking questions and creating discussion-worthy content.</p>

<h3>4. Upload Frequency and Freshness</h3>
<p>YouTube gives a boost to newly uploaded videos, especially on the homepage. Channels that upload consistently tend to perform better in recommendations.</p>

<h3>5. Session Time</h3>
<p>YouTube rewards videos that lead to longer viewing sessions. If viewers watch more videos after yours, YouTube considers your content a good entry point and recommends it more often.</p>

<h2>How to Optimize for the Algorithm</h2>
<ul>
<li>Create compelling hooks in the first 30 seconds to reduce early drop-offs</li>
<li>Use pattern interrupts (B-roll, graphics, changes in tone) to maintain attention</li>
<li>Design thumbnails that stand out and accurately represent your content</li>
<li>Write titles that spark curiosity while including searchable keywords</li>
<li>Publish when your audience is most active (check YouTube Analytics)</li>
</ul>

<h2>The Role of Initial Views</h2>
<p>When a video is first published, YouTube tests it with a small audience to gauge performance. Strong initial engagement (views, likes, watch time) signals quality, leading to broader distribution. This is why many creators invest in boosting their initial view counts.</p>

<h2>Conclusion</h2>
<p>The YouTube algorithm is not something to fear — it is a tool to leverage. By creating content that genuinely serves your audience and optimizing your metadata, you can work with the algorithm to reach more viewers than ever before.</p>',
            ],
            [
                'title' => '10 Proven Tips to Increase Your YouTube Watch Time',
                'slug' => '10-tips-increase-youtube-watch-time',
                'excerpt' => 'Watch time is the most important metric for YouTube success. Here are 10 proven strategies to keep viewers watching your videos longer and boost your channel growth.',
                'category_id' => $tipsCategory?->id,
                'seo_title' => '10 Tips to Increase YouTube Watch Time | Proven Strategies',
                'meta_description' => 'Boost your YouTube watch time with these 10 proven strategies. Learn how to keep viewers engaged and increase your average view duration.',
                'content' => '<p>Watch time is the cornerstone of YouTube success. The more time viewers spend watching your videos, the more YouTube promotes your content. Here are 10 proven strategies to dramatically increase your watch time.</p>

<h2>1. Hook Viewers in the First 10 Seconds</h2>
<p>You have about 10 seconds to convince a viewer to keep watching. Start with a compelling hook — preview the value they will get, ask an intriguing question, or show a dramatic result that makes them want to learn more.</p>

<h2>2. Use Pattern Interrupts</h2>
<p>Keep viewers engaged by changing things up every 30-60 seconds. Switch camera angles, add B-roll footage, use graphics, or change your tone of voice. These pattern interrupts prevent boredom and re-engage attention.</p>

<h2>3. Create Longer Videos (8-15 Minutes)</h2>
<p>Longer videos accumulate more watch time, but only if they maintain quality throughout. Aim for 8-15 minutes for most content types. Do not pad your videos with filler — every minute should provide value.</p>

<h2>4. Use Chapters and Timestamps</h2>
<p>Adding chapters to your videos helps viewers navigate to the sections that interest them most. This reduces bounce rates and increases overall watch time, as viewers can easily find the content they want.</p>

<h2>5. Tell Stories</h2>
<p>Human brains are wired for stories. Structure your videos with a narrative arc: setup, conflict, and resolution. Even educational content can be framed as a story to keep viewers invested.</p>

<h2>6. Create Playlists</h2>
<p>Group related videos into playlists. When one video ends, the next automatically plays. This can dramatically increase your total channel watch time and keep viewers in your content ecosystem.</p>

<h2>7. Use End Screens and Cards</h2>
<p>Add end screens and cards to direct viewers to your other videos. A well-placed card at the right moment can keep viewers on your channel instead of leaving for someone else\'s content.</p>

<h2>8. Optimize Your Video Pacing</h2>
<p>Cut out pauses, ums, and dead space. Tight editing keeps the pace up and prevents viewers from losing interest. Tools like jump cuts can make your content feel more dynamic and engaging.</p>

<h2>9. Deliver on Your Promise</h2>
<p>Make sure your video delivers what your title and thumbnail promise. Clickbait might get initial clicks, but it destroys watch time when viewers feel misled and leave early.</p>

<h2>10. Boost Initial View Counts</h2>
<p>Videos with higher view counts attract more organic viewers, which leads to more total watch time. Consider investing in YouTube views to give your videos the initial boost they need to gain traction in the algorithm.</p>

<h2>Conclusion</h2>
<p>Increasing watch time is about creating content that genuinely engages your audience from start to finish. Implement these strategies consistently, and you will see significant improvements in your watch time metrics and overall channel growth.</p>',
            ],
            [
                'title' => 'Is It Safe to Buy YouTube Views? Everything You Need to Know',
                'slug' => 'is-it-safe-to-buy-youtube-views',
                'excerpt' => 'Wondering if buying YouTube views is safe? We cover everything you need to know about purchasing views, the risks, benefits, and how to do it the right way.',
                'category_id' => $growthCategory?->id,
                'seo_title' => 'Is It Safe to Buy YouTube Views? Complete Guide 2026',
                'meta_description' => 'Learn whether buying YouTube views is safe and effective. Understand the risks, benefits, and best practices for purchasing YouTube views.',
                'content' => '<p>One of the most common questions from YouTube creators is: "Is it safe to buy YouTube views?" The short answer is yes — when done correctly with a reputable provider. Let us break down everything you need to know.</p>

<h2>Why Do Creators Buy YouTube Views?</h2>
<p>There are several legitimate reasons why creators invest in YouTube views:</p>
<ul>
<li><strong>Social Proof:</strong> Videos with higher view counts appear more credible and attract more organic clicks</li>
<li><strong>Algorithm Boost:</strong> Higher view counts signal quality to YouTube\'s algorithm, leading to more recommendations</li>
<li><strong>Kickstarting Growth:</strong> New channels often struggle to get initial traction; bought views can help overcome this hurdle</li>
<li><strong>Competitive Edge:</strong> In crowded niches, a higher view count can make your video stand out</li>
</ul>

<h2>Is It Against YouTube\'s Terms of Service?</h2>
<p>YouTube prohibits artificial view inflation through bots and automated systems. However, views from real users who voluntarily watch your content are perfectly fine. The key distinction is the quality and source of the views.</p>

<h2>What Makes Views Safe vs. Unsafe?</h2>

<h3>Safe Views (What to Look For)</h3>
<ul>
<li>Views from real user accounts</li>
<li>Gradual, natural-looking delivery</li>
<li>Geographic diversity in viewer locations</li>
<li>Reasonable retention rates</li>
<li>Provider has a track record and positive reviews</li>
</ul>

<h3>Unsafe Views (Red Flags)</h3>
<ul>
<li>Extremely cheap pricing (you get what you pay for)</li>
<li>Instant delivery of thousands of views</li>
<li>Views from bot accounts</li>
<li>Provider asks for your YouTube password</li>
<li>No refund policy or customer support</li>
</ul>

<h2>How to Buy Views Safely</h2>
<ol>
<li><strong>Choose a reputable provider</strong> with positive reviews and a proven track record</li>
<li><strong>Start small</strong> with a smaller package to test the quality</li>
<li><strong>Check for a refund policy</strong> and customer support availability</li>
<li><strong>Ensure gradual delivery</strong> to mimic organic growth patterns</li>
<li><strong>Never share your password</strong> — legitimate services only need your video URL</li>
</ol>

<h2>The Benefits of Buying Views</h2>
<p>When done right, buying views can:</p>
<ul>
<li>Increase your video visibility in search results</li>
<li>Attract more organic viewers through social proof</li>
<li>Help you reach monetization thresholds faster</li>
<li>Boost your channel credibility with brands and sponsors</li>
</ul>

<h2>Conclusion</h2>
<p>Buying YouTube views is safe when you choose a quality provider that delivers real views through legitimate methods. It is a strategy used by thousands of successful creators to accelerate their growth. Just make sure you combine it with great content for the best results.</p>',
            ],
            [
                'title' => 'YouTube Monetization Requirements: Complete Guide for 2026',
                'slug' => 'youtube-monetization-requirements-2026',
                'excerpt' => 'Want to start earning money on YouTube? Learn about the latest monetization requirements, how to meet them faster, and tips to maximize your YouTube revenue.',
                'category_id' => $monetizationCategory?->id,
                'seo_title' => 'YouTube Monetization Requirements 2026 | Complete Guide',
                'meta_description' => 'Learn the YouTube Partner Program requirements for 2026. Discover how to reach 1,000 subscribers and 4,000 watch hours faster.',
                'content' => '<p>Monetizing your YouTube channel is a major milestone for any creator. The YouTube Partner Program (YPP) allows you to earn money from ads, memberships, and more. Here is everything you need to know about the requirements and how to meet them.</p>

<h2>YouTube Partner Program Requirements (2026)</h2>
<p>To join the YouTube Partner Program and start earning ad revenue, you need:</p>
<ul>
<li><strong>1,000 subscribers</strong> on your channel</li>
<li><strong>4,000 watch hours</strong> in the past 12 months, OR <strong>10 million Shorts views</strong> in the past 90 days</li>
<li>An <strong>AdSense account</strong> linked to your channel</li>
<li>Compliance with YouTube\'s <strong>monetization policies</strong> and community guidelines</li>
<li>Two-step verification enabled on your Google account</li>
<li>Available in a <strong>supported country</strong></li>
</ul>

<h2>How to Reach 1,000 Subscribers Faster</h2>
<ul>
<li><strong>Create a channel trailer</strong> that introduces new visitors to your content</li>
<li><strong>Ask viewers to subscribe</strong> in every video with a clear call-to-action</li>
<li><strong>Be consistent</strong> with your upload schedule (at least once a week)</li>
<li><strong>Collaborate</strong> with other creators in your niche</li>
<li><strong>Optimize your channel page</strong> with a compelling banner and description</li>
<li><strong>Consider buying subscribers</strong> from a reputable provider to accelerate growth</li>
</ul>

<h2>How to Reach 4,000 Watch Hours</h2>
<p>4,000 watch hours equals about 240,000 minutes of total viewing time. Here is how to get there:</p>
<ul>
<li><strong>Create longer videos</strong> (10-20 minutes) that provide deep value</li>
<li><strong>Use playlists</strong> to encourage binge-watching</li>
<li><strong>Go live</strong> — live streams count towards watch time and can accumulate hours quickly</li>
<li><strong>Focus on evergreen content</strong> that continues to attract views over time</li>
<li><strong>Invest in watch time services</strong> to reach the threshold faster</li>
</ul>

<h2>Revenue Streams After Monetization</h2>
<p>Once you join the YPP, you can earn from multiple sources:</p>
<ul>
<li><strong>Ad Revenue:</strong> Display, overlay, and video ads on your content</li>
<li><strong>Channel Memberships:</strong> Monthly subscriptions from loyal fans ($4.99/month)</li>
<li><strong>Super Chat & Super Stickers:</strong> Paid messages during live streams</li>
<li><strong>YouTube Shopping:</strong> Sell merchandise directly from your channel</li>
<li><strong>YouTube Premium Revenue:</strong> Share of subscription fees from Premium viewers</li>
</ul>

<h2>How Much Can You Earn?</h2>
<p>YouTube CPM (cost per 1,000 ad views) varies by niche:</p>
<ul>
<li>Finance/Business: $12-$30 CPM</li>
<li>Technology: $8-$15 CPM</li>
<li>Gaming: $3-$8 CPM</li>
<li>Entertainment: $2-$6 CPM</li>
<li>Education: $5-$12 CPM</li>
</ul>

<h2>Conclusion</h2>
<p>Meeting YouTube monetization requirements is achievable with the right strategy. Focus on creating valuable content, growing your subscriber base, and accumulating watch hours. If you need a boost, services like buying subscribers and watch time can help you reach the threshold faster so you can start earning sooner.</p>',
            ],
        ];

        foreach ($posts as $postData) {
            Post::create(array_merge($postData, [
                'author_id' => $admin->id,
                'status' => 'published',
                'published_at' => now()->subDays(rand(1, 30)),
            ]));
        }
    }

    // ─────────────────────────────────────────────
    // SETTINGS
    // ─────────────────────────────────────────────
    protected function createSettings(): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'AYN YouTube', 'group' => 'general'],
            ['key' => 'site_description', 'value' => 'Premium YouTube Growth Services', 'group' => 'general'],
            ['key' => 'contact_email', 'value' => 'support@ayn.yt', 'group' => 'contact'],
            ['key' => 'whatsapp_number', 'value' => '+965XXXXXXXX', 'group' => 'contact'],
            ['key' => 'currency', 'value' => 'USD', 'group' => 'payment'],
            ['key' => 'payment_gateway', 'value' => 'stripe', 'group' => 'payment'],
        ];

        foreach ($settings as $setting) {
            Setting::set($setting['key'], $setting['value'], $setting['group']);
        }
    }
}
