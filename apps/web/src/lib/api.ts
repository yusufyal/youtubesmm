import type {
  Service,
  Package,
  Post,
  FAQ,
  Page,
  QuoteRequest,
  QuoteResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
  PaginatedResponse,
  AuthResponse,
  ApiError,
} from '@aynyoutube/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/api';
const API_BASE = API_BASE_URL.replace('/api', '');

class ApiClient {
  private baseUrl: string;
  private baseUrlRoot: string;
  private token: string | null = null;
  private csrfInitialized: boolean = false;

  constructor(baseUrl: string, baseUrlRoot: string) {
    this.baseUrl = baseUrl;
    this.baseUrlRoot = baseUrlRoot;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  // Get XSRF token from cookies
  private getXsrfToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
    return null;
  }

  // Initialize CSRF cookie for stateful requests
  async initCsrf(): Promise<void> {
    if (this.csrfInitialized) return;
    
    try {
      await fetch(`${this.baseUrlRoot}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });
      this.csrfInitialized = true;
    } catch (error) {
      console.error('Failed to initialize CSRF:', error);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    // Add Bearer token if available
    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    // Add XSRF token for CSRF protection
    const xsrfToken = this.getXsrfToken();
    if (xsrfToken) {
      (headers as Record<string, string>)['X-XSRF-TOKEN'] = xsrfToken;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for CSRF
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiError;
      throw new Error(error.message || 'An error occurred');
    }

    return data.data ?? data;
  }

  // Public endpoints
  async getServices(): Promise<Service[]> {
    return this.request<Service[]>('/public/services');
  }

  async getService(slug: string): Promise<Service> {
    return this.request<Service>(`/public/services/${slug}`);
  }

  async getPosts(params?: { page?: number; category?: string }): Promise<PaginatedResponse<Post>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.category) searchParams.set('category', params.category);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<PaginatedResponse<Post>>(`/public/posts${query}`);
  }

  async getPost(slug: string): Promise<Post> {
    return this.request<Post>(`/public/posts/${slug}`);
  }

  async getFAQs(grouped?: boolean): Promise<{ category: string; items: FAQ[] }[]> {
    return this.request<{ category: string; items: FAQ[] }[]>(`/public/faqs?grouped=${grouped ?? true}`);
  }

  async getPage(slug: string): Promise<Page> {
    return this.request<Page>(`/public/pages/${slug}`);
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    // Initialize CSRF before login
    await this.initCsrf();
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<AuthResponse> {
    // Initialize CSRF before register
    await this.initCsrf();
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout', { method: 'POST' });
  }

  async getUser(): Promise<{ id: number; name: string; email: string }> {
    return this.request('/auth/user');
  }

  // Checkout endpoints
  async getQuote(data: QuoteRequest): Promise<QuoteResponse> {
    return this.request<QuoteResponse>('/checkout/quote', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    return this.request<CreateOrderResponse>('/checkout/create-order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createBulkOrder(data: {
    items: Array<{
      package_id: number;
      quantity: number;
      target_link: string;
    }>;
    coupon_code?: string;
    guest_email: string;
  }): Promise<CreateOrderResponse> {
    return this.request<CreateOrderResponse>('/checkout/create-bulk-order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async validateCoupon(code: string, amount: number): Promise<{
    code: string;
    type: string;
    value: number;
    discount: number;
    valid: boolean;
  }> {
    return this.request('/checkout/validate-coupon', {
      method: 'POST',
      body: JSON.stringify({ code, amount }),
    });
  }

  async createPaymentIntent(orderId: number): Promise<{ client_secret: string }> {
    return this.request('/payments/stripe/create-intent', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId }),
    });
  }

  // Customer endpoints
  async getMyOrders(page?: number): Promise<PaginatedResponse<Order>> {
    const query = page ? `?page=${page}` : '';
    return this.request<PaginatedResponse<Order>>(`/my/orders${query}`);
  }

  async getMyOrder(id: number): Promise<Order> {
    return this.request<Order>(`/my/orders/${id}`);
  }

  async requestRefill(orderId: number): Promise<{ ticket_id: number; message: string }> {
    return this.request(`/my/orders/${orderId}/refill`, { method: 'POST' });
  }
}

export const api = new ApiClient(API_BASE_URL, API_BASE);
export default api;
