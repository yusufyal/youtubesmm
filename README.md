# AYN YouTube - SMM Panel

A production-ready, SEO-friendly YouTube SMM services platform with express checkout, customer dashboard, and admin panel.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Laravel 12 + MySQL + Redis
- **Payments**: Stripe (global) / Tap Payments (GCC)
- **Deployment**: Vercel (frontend) + Railway/VPS (backend)

## Project Structure

```
aynyoutube/
├── apps/
│   ├── web/          # Public website + customer dashboard
│   └── admin/        # Admin panel
├── api/              # Laravel backend
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── config/       # Shared configuration
│   └── ui/           # Shared UI components
└── docs/             # Documentation
```

## Getting Started

### Prerequisites

- Node.js 20+
- PHP 8.2+
- MySQL 8.0+
- Redis 7+
- pnpm 9+
- Composer

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url> aynyoutube
   cd aynyoutube
   ```

2. **Install frontend dependencies**
   ```bash
   pnpm install
   ```

3. **Install backend dependencies**
   ```bash
   cd api
   composer install
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure environment**
   - Update `api/.env` with your database and API credentials
   - Create `apps/web/.env.local` and `apps/admin/.env.local`

5. **Set up database**
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE aynyoutube;"
   
   # Run migrations and seeders
   cd api
   php artisan migrate --seed
   ```

6. **Start development servers**
   ```bash
   # From root directory
   pnpm dev
   
   # Or individually:
   cd api && php artisan serve           # API: http://localhost:8000
   cd apps/web && pnpm dev               # Web: http://localhost:3000
   cd apps/admin && pnpm dev             # Admin: http://localhost:3001
   ```

### Default Admin Credentials

After seeding:
- Email: `admin@ayn.yt`
- Password: `password`

## Features

### Public Website
- SEO-optimized pages with structured data
- Service listings with dynamic pricing
- Express checkout (guest + registered)
- Blog with categories and tags
- FAQ with accordion UI
- Dynamic sitemap and robots.txt

### Customer Dashboard
- Order tracking with progress
- Refill requests
- Support tickets

### Admin Panel
- Services & packages management
- Orders management with status updates
- User management with RBAC
- Coupons & discounts
- Content management (blog, FAQs, pages)
- Provider integration
- Sales reports & analytics

## API Documentation

See [docs/api-contract.md](docs/api-contract.md) for full API documentation.

## Deployment

See [docs/deployment.md](docs/deployment.md) for deployment instructions.

## Environment Variables

### Frontend (apps/web/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Backend (api/.env)
```
APP_URL=http://localhost:8000
DB_DATABASE=aynyoutube
DB_USERNAME=root
DB_PASSWORD=

REDIS_HOST=127.0.0.1
QUEUE_CONNECTION=redis

STRIPE_SECRET=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

SMM_PROVIDER_URL=https://api.smmprovider.com
SMM_PROVIDER_API_KEY=xxx
```

## Scripts

```bash
# Development
pnpm dev              # Start all apps in development
pnpm build            # Build all apps
pnpm lint             # Lint all apps

# Backend
cd api
php artisan serve     # Start API server
php artisan queue:work # Start queue worker
php artisan schedule:run # Run scheduler
```

## License

Proprietary - All rights reserved
