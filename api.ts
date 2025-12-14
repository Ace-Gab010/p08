import { API_BASE, getApiBase } from './config';
import { getToken } from './auth';

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const baseUrl = getApiBase();
    const url = baseUrl
      ? `${baseUrl}${endpoint}`
      : `/api/proxy/${endpoint.replace(/^\//, '')}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add authentication header if token exists
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    console.log('🌐 API Request:', {
      method: options.method || 'GET',
      url,
      headers: { ...headers, Authorization: token ? 'Bearer [TOKEN_HIDDEN]' : undefined },
      body: options.body ? JSON.parse(options.body as string) : undefined
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('📡 Response status:', response.status, response.statusText);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.log('🚫 Authentication failed - 401 status');
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Use console.warn instead of console.error to avoid Next.js error overlay
        console.warn('❌ API Error:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API Success:', data);
      return data;
    } catch (error) {
      // Use console.warn instead of console.error to avoid Next.js error overlay
      console.warn('💥 Request failed:', error);
      throw error;
    }
  },

  // Auth endpoints
  login: (username: string, password: string) =>
    api.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (username: string, password: string) =>
    api.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // Positions endpoints
  getPositions: () =>
    api.request('/positions'),

  createPosition: (data: { position_code: string; position_name: string }) =>
    api.request('/positions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePosition: (id: number, data: { position_code: string; position_name: string }) =>
    api.request(`/positions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deletePosition: (id: number) =>
    api.request(`/positions/${id}`, {
      method: 'DELETE',
    }),
};