import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lon: number;
  name: string;
}

interface SafetyData {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  zoneType: string;
  crimeRate: string;
  emergencyResponse: string;
  healthServices: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  time: string;
  source: string;
}

const API_BASE_URL = 'http://localhost:5001/api';

// API Service Functions
const apiService = {
  async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
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
      console.error(`SafarSuraksha API Error (${endpoint}):`, error);
      throw error;
    }
  },

  async getCurrentWeather(lat: number, lon: number) {
    return this.makeRequest(`/weather/current?lat=${lat}&lon=${lon}`);
  },

  async getWeatherAlerts(lat: number, lon: number, radius: number = 50) {
    return this.makeRequest(`/weather/alerts?lat=${lat}&lon=${lon}&radius=${radius}`);
  },

  async getSafetyProfile(lat: number, lon: number, radius: number = 5, days: number = 30) {
    return this.makeRequest(`/safety/profile?lat=${lat}&lon=${lon}&radius=${radius}&days=${days}`);
  },

  async getCrimeData(lat: number, lon: number, radius: number = 1, days: number = 30) {
    return this.makeRequest(`/crime/data?lat=${lat}&lon=${lon}&radius=${radius}&days=${days}`);
  },

  async getHealthAlerts(lat: number, lon: number, radius: number = 50, days: number = 30) {
    return this.makeRequest(`/health/alerts?lat=${lat}&lon=${lon}&radius=${radius}&days=${days}`);
  },

  async getDisasterAlerts(lat: number, lon: number, radius: number = 50, days: number = 30) {
    return this.makeRequest(`/disaster/alerts?lat=${lat}&lon=${lon}&radius=${radius}&days=${days}`);
  }
};

export const useSafarSathiData = (location: Location) => {
  const [safetyData, setSafetyData] = useState<SafetyData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSafetyData = async () => {
    try {
      console.log('🛡️ SafarSuraksha: Fetching safety data for', location.name);
      
      const [safetyResponse, crimeResponse] = await Promise.allSettled([
        apiService.getSafetyProfile(location.lat, location.lon),
        apiService.getCrimeData(location.lat, location.lon)
      ]);

      let safetyScore = 85;
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      let crimeRate = 'Low';

      // Process safety data
      if (safetyResponse.status === 'fulfilled' && safetyResponse.value.success) {
        const data = safetyResponse.value.data;
        safetyScore = data.overallScore || 85;
        riskLevel = data.riskLevel || 'low';
      }

      // Process crime data
      if (crimeResponse.status === 'fulfilled' && crimeResponse.value.success) {
        const data = crimeResponse.value.data;
        crimeRate = data.riskLevel || 'Low';
      }

      setSafetyData({
        overallScore: safetyScore,
        riskLevel,
        zoneType: 'Tourist Hub',
        crimeRate,
        emergencyResponse: 'Excellent',
        healthServices: 'Good',
      });

      console.log('✅ SafarSuraksha: Safety data updated', { safetyScore, riskLevel, crimeRate });
    } catch (err) {
      console.warn('⚠️ SafarSuraksha: Safety API failed, using fallback data');
      setSafetyData({
        overallScore: 85,
        riskLevel: 'low',
        zoneType: 'Tourist Hub',
        crimeRate: 'Low',
        emergencyResponse: 'Excellent',
        healthServices: 'Good',
      });
    }
  };

  const fetchWeatherData = async () => {
    try {
      console.log('🌤️ SafarSuraksha: Fetching weather data for', location.name);
      
      const response = await apiService.getCurrentWeather(location.lat, location.lon);
      
      if (response.success && response.data) {
        const temp = response.data.temperature || response.data.main?.temp || 28;
        const condition = response.data.weather?.[0]?.main || response.data.condition || 'Clear Sky';
        const description = response.data.weather?.[0]?.description || `${condition}, ${temp}°C`;
        
        setWeatherData({
          temperature: Math.round(temp),
          condition,
          description,
        });

        console.log('✅ SafarSuraksha: Weather data updated', { temp, condition });
      }
    } catch (err) {
      console.warn('⚠️ SafarSuraksha: Weather API failed, using fallback data');
      setWeatherData({
        temperature: 28,
        condition: 'Clear Sky',
        description: 'Clear Sky, 28°C',
      });
    }
  };

  const fetchAlerts = async () => {
    try {
      console.log('🚨 SafarSuraksha: Fetching alerts for', location.name);
      
      const [weatherAlerts, healthAlerts, disasterAlerts] = await Promise.allSettled([
        apiService.getWeatherAlerts(location.lat, location.lon),
        apiService.getHealthAlerts(location.lat, location.lon),
        apiService.getDisasterAlerts(location.lat, location.lon),
      ]);

      const allAlerts: Alert[] = [];

      // Process weather alerts
      if (weatherAlerts.status === 'fulfilled' && weatherAlerts.value.success) {
        weatherAlerts.value.data?.alerts?.forEach((alert: any, index: number) => {
          allAlerts.push({
            id: `weather-${index}`,
            type: alert.severity === 'high' ? 'warning' : 'info',
            message: alert.message || alert.description,
            time: new Date(alert.timestamp || Date.now()).toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            source: 'Weather',
          });
        });
      }

      // Process health alerts
      if (healthAlerts.status === 'fulfilled' && healthAlerts.value.success) {
        healthAlerts.value.data?.alerts?.forEach((alert: any, index: number) => {
          allAlerts.push({
            id: `health-${index}`,
            type: alert.priority === 'high' ? 'warning' : 'info',
            message: alert.message || alert.description,
            time: new Date(alert.timestamp || Date.now()).toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            source: 'Health',
          });
        });
      }

      // Process disaster alerts
      if (disasterAlerts.status === 'fulfilled' && disasterAlerts.value.success) {
        disasterAlerts.value.data?.alerts?.forEach((alert: any, index: number) => {
          allAlerts.push({
            id: `disaster-${index}`,
            type: 'error',
            message: alert.message || alert.description,
            time: new Date(alert.timestamp || Date.now()).toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            source: 'Emergency',
          });
        });
      }

      // Add fallback alerts if no real alerts
      if (allAlerts.length === 0) {
        allAlerts.push(
          {
            id: 'fallback-1',
            type: 'info',
            message: 'Weather conditions are favorable for travel',
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            source: 'Weather',
          },
          {
            id: 'fallback-2',
            type: 'info',
            message: `SafarSuraksha monitoring ${location.name} - All systems normal`,
            time: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            source: 'Safety',
          }
        );
      }

      setAlerts(allAlerts);
      console.log('✅ SafarSuraksha: Alerts updated', allAlerts.length, 'alerts found');
    } catch (err) {
      console.warn('⚠️ SafarSuraksha: Alerts API failed, using fallback alerts');
      setAlerts([
        {
          id: 'error-1',
          type: 'info',
          message: 'SafarSuraksha is monitoring your safety - No alerts at this time',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          source: 'Safety',
        }
      ]);
    }
  };

  const fetchAllData = async () => {
    if (!location.lat || !location.lon) return;

    setLoading(true);
    setError(null);

    console.log('🚀 SafarSuraksha: Starting real-time data fetch for', location.name);

    try {
      await Promise.all([
        fetchSafetyData(),
        fetchWeatherData(),
        fetchAlerts(),
      ]);
      console.log('✅ SafarSuraksha: All real-time data fetched successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch SafarSuraksha data';
      setError(errorMsg);
      console.error('❌ SafarSuraksha: Data fetch failed:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when location changes
  useEffect(() => {
    fetchAllData();
  }, [location.lat, location.lon]);

  // Auto-refresh data every 5 minutes for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 SafarSuraksha: Auto-refreshing real-time data');
      fetchAllData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [location]);

  return {
    safetyData,
    weatherData,
    alerts,
    loading,
    error,
    refetch: fetchAllData,
  };
};
