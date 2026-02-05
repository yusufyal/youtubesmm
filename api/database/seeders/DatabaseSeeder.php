<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\FAQ;
use App\Models\Package;
use App\Models\Page;
use App\Models\Provider;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@ayn.yt',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        // Create a sample customer
        User::create([
            'name' => 'Test Customer',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);

        // Create default provider
        Provider::create([
            'name' => 'Default SMM Provider',
            'slug' => 'generic',
            'api_url' => 'https://api.example-smm.com',
            'api_key' => 'your-api-key-here',
            'active' => true,
        ]);

        // Create YouTube services
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
            $service = Service::create($serviceData);

            // Create packages for each service
            $this->createPackagesForService($service);
        }

        // Create FAQs
        $this->createFAQs();

        // Create static pages
        $this->createPages();

        // Create blog categories and tags
        $this->createBlogStructure();

        // Create sample coupon
        Coupon::create([
            'code' => 'WELCOME10',
            'type' => 'percentage',
            'value' => 10,
            'active' => true,
        ]);

        // Create default settings
        $this->createSettings();
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

    protected function createFAQs(): void
    {
        $faqs = [
            ['category' => 'General', 'question' => 'Is it safe to buy YouTube services?', 'answer' => 'Yes, our services are 100% safe. We use organic methods that comply with YouTube\'s terms of service.'],
            ['category' => 'General', 'question' => 'How long does delivery take?', 'answer' => 'Most orders start within 0-6 hours and complete within 24-72 hours depending on the quantity.'],
            ['category' => 'General', 'question' => 'Will my account get banned?', 'answer' => 'No, we have never had any customer accounts banned. Our methods are safe and organic.'],
            ['category' => 'Payment', 'question' => 'What payment methods do you accept?', 'answer' => 'We accept all major credit cards, debit cards, and PayPal through our secure payment gateway.'],
            ['category' => 'Payment', 'question' => 'Is my payment information secure?', 'answer' => 'Yes, all payments are processed through secure, encrypted payment gateways. We never store your card details.'],
            ['category' => 'Orders', 'question' => 'Can I track my order?', 'answer' => 'Yes, you can track your order status in real-time from your dashboard or using your order number.'],
            ['category' => 'Orders', 'question' => 'What if I don\'t receive my order?', 'answer' => 'We offer a full money-back guarantee. If your order is not delivered, you will receive a complete refund.'],
            ['category' => 'Refills', 'question' => 'Do you offer refills?', 'answer' => 'Yes, most of our services come with free refills for 30 days. If you experience any drops, simply request a refill.'],
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

    protected function createPages(): void
    {
        $pages = [
            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy-policy',
                'content' => '<h1>Privacy Policy</h1><p>Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information.</p>',
                'seo_title' => 'Privacy Policy | AYN YouTube',
            ],
            [
                'title' => 'Terms of Service',
                'slug' => 'terms-of-service',
                'content' => '<h1>Terms of Service</h1><p>By using our services, you agree to these terms of service.</p>',
                'seo_title' => 'Terms of Service | AYN YouTube',
            ],
            [
                'title' => 'Refund Policy',
                'slug' => 'refund-policy',
                'content' => '<h1>Refund Policy</h1><p>We offer a full money-back guarantee on all orders. If you are not satisfied, contact us for a refund.</p>',
                'seo_title' => 'Refund Policy | AYN YouTube',
            ],
        ];

        foreach ($pages as $pageData) {
            Page::create($pageData);
        }
    }

    protected function createBlogStructure(): void
    {
        $categories = ['YouTube Growth', 'Monetization', 'Tips & Tricks', 'Industry News'];
        foreach ($categories as $index => $name) {
            Category::create([
                'name' => $name,
                'slug' => \Illuminate\Support\Str::slug($name),
                'sort_order' => $index,
            ]);
        }

        $tags = ['YouTube', 'Growth', 'Subscribers', 'Views', 'Monetization', 'Tips', 'Algorithm', 'SEO'];
        foreach ($tags as $name) {
            Tag::create([
                'name' => $name,
                'slug' => \Illuminate\Support\Str::slug($name),
            ]);
        }
    }

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
