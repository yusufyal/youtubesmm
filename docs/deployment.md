# Deployment Guide

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Vercel        │     │   Railway/VPS   │
│   ─────────     │     │   ───────────   │
│   Next.js Web   │────▶│   Laravel API   │
│   Next.js Admin │     │   Queue Worker  │
└─────────────────┘     │   Scheduler     │
                        └────────┬────────┘
                                 │
                        ┌────────┴────────┐
                        │                 │
                   ┌────▼────┐      ┌─────▼────┐
                   │  MySQL  │      │  Redis   │
                   └─────────┘      └──────────┘
```

## Prerequisites

- Node.js 20+
- PHP 8.2+
- MySQL 8.0+
- Redis 7+
- Composer
- pnpm

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repo-url> aynyoutube
cd aynyoutube

# Install frontend dependencies
pnpm install

# Install Laravel dependencies
cd api
composer install
cp .env.example .env
php artisan key:generate
```

### 2. Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE aynyoutube;"

# Run migrations
php artisan migrate

# Seed initial data
php artisan db:seed
```

### 3. Start Development Servers

```bash
# From root directory
pnpm dev

# Or start individually:
# Laravel API
cd api && php artisan serve

# Next.js Web (port 3000)
cd apps/web && pnpm dev

# Next.js Admin (port 3001)
cd apps/admin && pnpm dev
```

## Production Deployment

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Root Directory: `apps/web` or `apps/admin`
   - Build Command: `pnpm build`
   - Output Directory: `.next`
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.ayn.yt/api
   NEXT_PUBLIC_SITE_URL=https://ayn.yt
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   ```

### Backend (Railway)

1. Create new Railway project
2. Add MySQL and Redis services
3. Deploy from GitHub:
   - Root Directory: `api`
   - Build Command: `composer install --no-dev`
   - Start Command: `php artisan serve --host=0.0.0.0 --port=$PORT`
4. Add Queue Worker:
   - Start Command: `php artisan queue:work --tries=3`
5. Set environment variables from `.env.example`

### Backend (VPS with Nginx)

```nginx
server {
    listen 80;
    server_name api.ayn.yt;
    root /var/www/aynyoutube/api/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## Queue Worker (Supervisor)

```ini
[program:aynyoutube-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/aynyoutube/api/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/aynyoutube/api/storage/logs/worker.log
stopwaitsecs=3600
```

## Cron Job (Scheduler)

```cron
* * * * * cd /var/www/aynyoutube/api && php artisan schedule:run >> /dev/null 2>&1
```

## SSL Certificates

Use Certbot for free SSL:

```bash
sudo certbot --nginx -d api.ayn.yt
sudo certbot --nginx -d ayn.yt
```

## Health Checks

- API: `GET /up` returns 200 if healthy
- Frontend: Vercel handles health checks automatically

## Monitoring

- Laravel Telescope (development)
- Sentry for error tracking
- Custom payment/provider logs in `storage/logs/`
