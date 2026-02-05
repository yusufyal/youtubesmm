# AYN YouTube API Contract

## Base URL
- Development: `http://localhost:8000/api`
- Production: `https://api.ayn.yt/api`

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Public Endpoints

### GET /public/services
List all active services with packages.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "YouTube Views",
      "slug": "youtube-views",
      "platform": "youtube",
      "type": "views",
      "description": "...",
      "packages": [...]
    }
  ]
}
```

### GET /public/services/{slug}
Get single service with packages.

### GET /public/posts
List published blog posts (paginated).

### GET /public/posts/{slug}
Get single blog post.

### GET /public/faqs
List FAQs grouped by category.

### GET /public/pages/{slug}
Get static page content.

---

## Authentication

### POST /auth/register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "password_confirmation": "Password123"
}
```

### POST /auth/login
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "John", "email": "..." },
    "token": "..."
  }
}
```

### POST /auth/logout (authenticated)

---

## Checkout

### POST /checkout/quote
Calculate order price server-side.

```json
{
  "package_id": 1,
  "quantity": 1000,
  "coupon_code": "WELCOME10"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subtotal": 9.99,
    "discount": 1.00,
    "total": 8.99,
    "currency": "USD"
  }
}
```

### POST /checkout/create-order
Create a pending order.

```json
{
  "package_id": 1,
  "quantity": 1000,
  "target_link": "https://youtube.com/watch?v=...",
  "coupon_code": "WELCOME10",
  "guest_email": "guest@example.com"
}
```

### POST /payments/stripe/create-intent
```json
{
  "order_id": 123
}
```

**Response:**
```json
{
  "client_secret": "pi_xxx_secret_xxx"
}
```

---

## Customer Endpoints (authenticated)

### GET /me
Get current user profile.

### GET /my/orders
List user's orders (paginated).

### GET /my/orders/{id}
Get order details.

### POST /my/orders/{id}/refill
Request refill for eligible order.

### POST /my/tickets
Create support ticket.

---

## Admin Endpoints (admin role required)

### Services
- `GET /admin/services`
- `POST /admin/services`
- `GET /admin/services/{id}`
- `PUT /admin/services/{id}`
- `DELETE /admin/services/{id}`

### Packages
- `GET /admin/packages`
- `POST /admin/packages`
- `PUT /admin/packages/{id}`
- `DELETE /admin/packages/{id}`

### Orders
- `GET /admin/orders`
- `GET /admin/orders/{id}`
- `PATCH /admin/orders/{id}`
- `POST /admin/orders/{id}/resend`
- `POST /admin/orders/{id}/refund`

### Reports
- `GET /admin/reports/summary`
- `GET /admin/reports/sales`
- `GET /admin/reports/top-services`

---

## Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

## Rate Limits
- Auth endpoints: 10 requests/minute
- Checkout endpoints: 10 requests/minute
- General API: 60 requests/minute
