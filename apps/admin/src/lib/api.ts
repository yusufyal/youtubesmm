import type {
  Service,
  Package,
  Order,
  User,
  Coupon,
  Post,
  FAQ,
  Page,
  Provider,
  PaginatedResponse,
  AuthResponse,
  SalesReport,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/api';
const API_BASE = API_BASE_URL.replace('/api', '');

class AdminApiClient {
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
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('admin_token', token);
      } else {
        localStorage.removeItem('admin_token');
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
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
    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
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
      if (response.status === 401) {
        this.setToken(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      throw new Error(data.message || 'An error occurred');
    }

    return data.data ?? data;
  }

  private async paginatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<PaginatedResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const xsrfToken = this.getXsrfToken();
    if (xsrfToken) {
      (headers as Record<string, string>)['X-XSRF-TOKEN'] = xsrfToken;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const json = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        this.setToken(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      throw new Error(json.message || 'An error occurred');
    }

    return {
      data: json.data ?? [],
      meta: json.meta,
      links: json.links ?? {},
    };
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    // Skip CSRF for cross-domain API calls - using Bearer token auth
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.setToken(null);
  }

  async getUser(): Promise<User> {
    return this.request('/auth/user');
  }

  // Services
  async getServices(): Promise<Service[]> {
    return this.request('/admin/services');
  }

  async getService(id: number): Promise<Service> {
    return this.request(`/admin/services/${id}`);
  }

  async createService(data: Partial<Service>): Promise<Service> {
    return this.request('/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: number, data: Partial<Service>): Promise<Service> {
    return this.request(`/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: number): Promise<void> {
    return this.request(`/admin/services/${id}`, { method: 'DELETE' });
  }

  // Packages
  async getPackages(serviceId?: number): Promise<Package[]> {
    const query = serviceId ? `?service_id=${serviceId}` : '';
    return this.request(`/admin/packages${query}`);
  }

  async createPackage(data: Partial<Package>): Promise<Package> {
    return this.request('/admin/packages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePackage(id: number, data: Partial<Package>): Promise<Package> {
    return this.request(`/admin/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePackage(id: number): Promise<void> {
    return this.request(`/admin/packages/${id}`, { method: 'DELETE' });
  }

  // Orders
  async getOrders(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    payment_status?: string;
  }): Promise<PaginatedResponse<Order>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.per_page) searchParams.set('per_page', params.per_page.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.payment_status) searchParams.set('payment_status', params.payment_status);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.paginatedRequest(`/admin/orders${query}`);
  }

  async getOrder(id: number): Promise<Order> {
    return this.request(`/admin/orders/${id}`);
  }

  async updateOrder(id: number, data: Partial<Order>): Promise<Order> {
    return this.request(`/admin/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Users
  async getUsers(params?: { page?: number; role?: string }): Promise<PaginatedResponse<User>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.role) searchParams.set('role', params.role);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.paginatedRequest(`/admin/users${query}`);
  }

  async createUser(data: Partial<User> & { password: string }): Promise<User> {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: number): Promise<void> {
    return this.request(`/admin/users/${id}`, { method: 'DELETE' });
  }

  // Coupons
  async getCoupons(): Promise<PaginatedResponse<Coupon>> {
    return this.paginatedRequest('/admin/coupons');
  }

  async createCoupon(data: Partial<Coupon>): Promise<Coupon> {
    return this.request('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCoupon(id: number, data: Partial<Coupon>): Promise<Coupon> {
    return this.request(`/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCoupon(id: number): Promise<void> {
    return this.request(`/admin/coupons/${id}`, { method: 'DELETE' });
  }

  // Posts
  async getPosts(): Promise<PaginatedResponse<Post>> {
    return this.paginatedRequest('/admin/posts');
  }

  async createPost(data: Partial<Post>): Promise<Post> {
    return this.request('/admin/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePost(id: number, data: Partial<Post>): Promise<Post> {
    return this.request(`/admin/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePost(id: number): Promise<void> {
    return this.request(`/admin/posts/${id}`, { method: 'DELETE' });
  }

  // FAQs
  async getFAQs(): Promise<FAQ[]> {
    return this.request('/admin/faqs');
  }

  async createFAQ(data: Partial<FAQ>): Promise<FAQ> {
    return this.request('/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFAQ(id: number, data: Partial<FAQ>): Promise<FAQ> {
    return this.request(`/admin/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFAQ(id: number): Promise<void> {
    return this.request(`/admin/faqs/${id}`, { method: 'DELETE' });
  }

  // Providers
  async getProviders(): Promise<Provider[]> {
    return this.request('/admin/providers');
  }

  async createProvider(data: Partial<Provider>): Promise<Provider> {
    return this.request('/admin/providers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async testProvider(id: number): Promise<{ success: boolean; balance?: number }> {
    return this.request(`/admin/providers/${id}/test`, { method: 'POST' });
  }

  async updateProvider(id: number, data: Partial<Provider>): Promise<Provider> {
    return this.request(`/admin/providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProvider(id: number): Promise<void> {
    return this.request(`/admin/providers/${id}`, { method: 'DELETE' });
  }

  // Settings
  async getSettings(group?: string): Promise<Record<string, any>> {
    const query = group ? `?group=${group}` : '';
    return this.request(`/admin/settings${query}`);
  }

  async updateSettings(settings: Record<string, any>): Promise<void> {
    return this.request('/admin/settings', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    });
  }

  // Order Actions
  async resendOrder(id: number): Promise<void> {
    return this.request(`/admin/orders/${id}/resend`, { method: 'POST' });
  }

  async refundOrder(id: number): Promise<void> {
    return this.request(`/admin/orders/${id}/refund`, { method: 'POST' });
  }

  // Reports
  async getReportSummary(): Promise<{
    revenue: Record<string, number>;
    orders: Record<string, number>;
    users: Record<string, number>;
    conversion: { rate: number; total_orders: number; paid_orders: number };
  }> {
    return this.request('/admin/reports/summary');
  }

  async getSalesReport(days?: number): Promise<{ date: string; orders: number; revenue: number }[]> {
    const query = days ? `?days=${days}` : '';
    return this.request(`/admin/reports/sales${query}`);
  }

  async getTopServices(): Promise<{
    service_id: number;
    service_name: string;
    total_orders: number;
    total_revenue: number;
  }[]> {
    return this.request('/admin/reports/top-services');
  }
}

export const adminApi = new AdminApiClient(API_BASE_URL, API_BASE);
export default adminApi;
