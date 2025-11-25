import { API_CONFIG } from '../config/constants';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.maxRetries = 3;
    this.retryDelay = 1000; // ms
  }

  async request(endpoint, options = {}, retryCount = 0) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error('Request timeout after', this.timeout, 'ms');
        throw new Error('La solicitud tardó demasiado tiempo. Por favor, intenta de nuevo.');
      }
      
      // Reintentar en caso de error de conexión
      if (retryCount < this.maxRetries && (error.message.includes('Failed to fetch') || error.message.includes('fetch'))) {
        console.warn(`Reintentando solicitud (${retryCount + 1}/${this.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        return this.request(endpoint, options, retryCount + 1);
      }
      
      console.error('API Request failed:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, data = null) {
    const options = { method: 'DELETE' };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return this.request(endpoint, options);
  }
}

export default new ApiService();
