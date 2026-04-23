const API_BASE_URL = 'http://localhost:5001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('clerk-token') || null;
  }

  setAuthToken(token: string) {
    this.token = token;
    if (token) {
      localStorage.setItem('clerk-token', token);
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Weather APIs
  async getCurrentWeather(lat: number, lon: number) {
    return this.makeRequest(`/weather/current?lat=${lat}&lon=${lon}`);
  }

  async getWeatherAlerts(lat: number, lon: number, radius: number = 50) {
    return this.makeRequest(`/weather/alerts?lat=${lat}&lon=${lon}&radius=${radius}`);
  }

  // Safety APIs
  async getSafetyProfile(lat: number, lon: number, radius: number = 5, days: number = 30) {
    return this.makeRequest(`/safety/profile?lat=${lat}&lon=${lon}&radius=${radius}&days=${days}`);
  }

  // Crime APIs
  async getCrimeData(lat: number, lon: number, radius: number = 1, days: number = 30) {
    return this.makeRequest(`/crime/data?lat=${lat}&lon=${lon}&radius=${radius}&days=${days}`);
  }

  // Health APIs
  async getHealthAlerts(lat: number, lon: number, radius: number = 50, days: number = 30) {
    return this.makeRequest(`/health/alerts?lat=${lat}&lon=${lon}&radius=${radius}&days=${days}`);
  }

  // Disaster APIs
  async getDisasterAlerts(lat: number, lon: number, radius: number = 50, days: number = 30) {
    return this.makeRequest(`/disaster/alerts?lat=${lat}&lon=${lon}&radius=${radius}&days=${days}`);
  }

  // Walkie APIs
  async getNearbyMessages(lat: number, lon: number, range: number = 1000, limit: number = 50) {
    return this.makeRequest(`/walkie-talkie/messages/nearby?latitude=${lat}&longitude=${lon}&range=${range}&limit=${limit}`);
  }

  async sendMessage(message: string, lat: number, lon: number, options: any = {}) {
    return this.makeRequest('/walkie-talkie/message', {
      method: 'POST',
      body: JSON.stringify({
        message,
        latitude: lat,
        longitude: lon,
        ...options,
      }),
    });
  }
}

export default new ApiService();
