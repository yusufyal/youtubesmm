// ============================================
// Core Entity Types
// ============================================

export type UserRole = 'customer' | 'admin' | 'super_admin' | 'support';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'twitter';
export type ServiceType = 'views' | 'subscribers' | 'watch_time' | 'comments' | 'likes' | 'shares';

export interface Service {
  id: number;
  name: string;
  slug: string;
  platform: Platform;
  type: ServiceType;
  description: string;
  short_description?: string;
  icon?: string;
  seo_title?: string;
  meta_description?: string;
  schema_data?: Record<string, unknown>;
  active: boolean;
  sort_order: number;
  packages?: Package[];
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: number;
  service_id: number;
  service?: Service;
  name: string;
  quantity: number;
  price: number;
  original_price?: number;
  estimated_time: string;
  description?: string;
  min_quantity: number;
  max_quantity: number;
  refill_eligible: boolean;
  refill_days: number;
  provider_id?: number;
  provider_service_id?: string;
  active: boolean;
  featured?: boolean;
  features?: string[];
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'in_progress'
  | 'completed'
  | 'partial'
  | 'canceled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface OrderLink {
  url: string;
  quantity: number;
}

export interface Order {
  id: number;
  order_number: string;
  group_id?: string;
  user_id?: number;
  user?: User;
  package_id: number;
  package?: Package;
  guest_email?: string;
  target_link: string;
  target_links?: OrderLink[];
  quantity: number;
  amount: number;
  discount: number;
  coupon_id?: number;
  coupon?: Coupon;
  status: OrderStatus;
  payment_status: PaymentStatus;
  provider_order_id?: string;
  provider_response?: Record<string, unknown>;
  start_count?: number;
  current_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  order_id: number;
  provider: 'stripe' | 'tap' | 'knet';
  reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type CouponType = 'percentage' | 'fixed';

export interface Coupon {
  id: number;
  code: string;
  type: CouponType;
  value: number;
  min_order?: number;
  usage_limit?: number;
  used_count: number;
  expires_at?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type PostStatus = 'draft' | 'published' | 'archived';

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category_id?: number;
  category?: Category;
  tags?: Tag[];
  seo_title?: string;
  meta_description?: string;
  status: PostStatus;
  published_at?: string;
  author_id?: number;
  author?: User;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  seo_title?: string;
  meta_description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: number;
  user_id: number;
  user?: User;
  order_id?: number;
  order?: Order;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: number;
  name: string;
  slug: string;
  api_url: string;
  api_key?: string;
  active: boolean;
  balance?: number;
  settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: number;
  key: string;
  value: unknown;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  user?: User;
  action: string;
  model_type: string;
  model_id: number;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

// ============================================
// API Request/Response Types
// ============================================

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Checkout
export interface QuoteRequest {
  package_id: number;
  quantity: number;
  coupon_code?: string;
}

export interface QuoteResponse {
  package: Package;
  quantity: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
}

export interface CreateOrderRequest {
  package_id: number;
  quantity: number;
  target_link?: string;
  links?: OrderLink[];
  coupon_code?: string;
  guest_email?: string;
}

export interface CreateOrderResponse {
  order_id: number;
  order_number: string;
  amount: number;
  currency: string;
  links_count?: number;
}

export interface CreatePaymentIntentRequest {
  order_id: number;
}

export interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

// API Error
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Reports
export interface SalesSummary {
  today: number;
  yesterday: number;
  this_week: number;
  this_month: number;
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
}

export interface TopService {
  service_id: number;
  service_name: string;
  total_orders: number;
  total_revenue: number;
}

export interface SalesReport {
  summary: SalesSummary;
  top_services: TopService[];
  daily_sales: { date: string; amount: number; orders: number }[];
}
