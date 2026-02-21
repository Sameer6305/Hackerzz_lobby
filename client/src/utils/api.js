// In production (Vercel), VITE_API_URL is set to the Render backend URL.
// In development, it's undefined so the Vite proxy (/api → localhost:5000) is used.
const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

// Wake up Render free-tier server on app load (prevents cold-start timeout on first user action)
if (import.meta.env.VITE_API_URL) {
  fetch(`${import.meta.env.VITE_API_URL}/api/health`, { method: 'GET' }).catch(() => {});
}

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

    // Retry once on network failure (handles Render cold-start ~30s spin-up)
    let response;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        response = await fetch(url, { ...config, signal: AbortSignal.timeout(35000) });
        break;
      } catch (fetchErr) {
        if (attempt === 2) throw fetchErr;
        // Wait 2s then retry
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    try {
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
