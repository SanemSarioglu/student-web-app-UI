// API Service Layer - Clean Architecture
const API_BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

class ApiService {
  private async makeRequest<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        return {
          data: data as T,
          error: null,
          success: true
        };
      } else {
        return {
          data: null,
          error: 'Response is not an array',
          success: false
        };
      }
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  async getCourses(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/courses');
  }

  async getStudents(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/students');
  }

  async getDepartments(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/departments');
  }

  async getInstructors(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/instructors');
  }

  async getEnrollments(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/enrollment');
  }

  async getSections(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('/sections');
  }
}

export const apiService = new ApiService(); 