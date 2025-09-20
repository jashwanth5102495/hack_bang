import AsyncStorage from '@react-native-async-storage/async-storage';

// Base configuration
const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Get stored auth token
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Store auth token
  private async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error storing auth token:', error);
    }
  }

  // Remove auth token
  private async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      const url = `${this.baseURL}${endpoint}`;

      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    age?: number;
    bio?: string;
    interests?: string[];
  }): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      await this.setAuthToken(response.data.token);
    }

    return response;
  }

  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      await this.setAuthToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    await this.removeAuthToken();
    return response;
  }

  // User profile methods
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData: {
    name?: string;
    age?: number;
    bio?: string;
    interests?: string[];
    currentMood?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async updateUserLocation(location: {
    latitude: number;
    longitude: number;
  }): Promise<ApiResponse<any>> {
    return this.request('/users/location', {
      method: 'PUT',
      body: JSON.stringify({
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
      }),
    });
  }

  // Mood-related methods
  async saveMoodAnalysis(moodData: {
    mood: string;
    analysis?: any;
  }): Promise<ApiResponse<any>> {
    return this.request('/moods/analysis', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  }

  async getMoodHistory(): Promise<ApiResponse<any[]>> {
    return this.request('/moods/history');
  }

  async getMoodStats(): Promise<ApiResponse<any>> {
    return this.request('/moods/stats');
  }

  // Utility methods
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get current auth status
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return !!token;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;