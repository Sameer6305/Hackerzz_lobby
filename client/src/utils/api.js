const API_BASE = '/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle empty or non-JSON responses safely
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // Server returned non-JSON (e.g. HTML error page, empty body)
        if (!response.ok) {
          const error = new Error(
            response.status === 502 || response.status === 503 || response.status === 0
              ? 'Server is unavailable. Please try again later.'
              : `Server error (${response.status})`
          );
          error.status = response.status;
          throw error;
        }
        const error = new Error('Invalid response from server');
        error.status = response.status;
        throw error;
      }

      if (!response.ok) {
        const error = new Error(data.message || 'Request failed');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // Network error (server completely unreachable)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const networkError = new Error('Cannot connect to server. Please check if the server is running.');
        networkError.status = 0;
        throw networkError;
      }
      if (error.status === 401 && this.getToken()) {
        // Only auto-redirect for expired/invalid tokens on authenticated requests
        // Don't redirect on login/register failures
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
      }
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiClient();
export default api;
