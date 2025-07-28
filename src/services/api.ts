// API Service Layer - Clean Architecture
const API_BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Interface for database course structure
interface DatabaseCourse {
  courseCode: string;
  courseName: string;
  credits: number;
  prerequisites: string;
  isActive?: boolean;
  active?: boolean;
  majorDepartment: {
    departmentCode: string;
    departmentName: string;
    headOfDepartment: string;
  };
  availableForSemester: string;
  instructor: string;
}

// Transform database course to frontend ClassData format
const transformCourseToClassData = (dbCourse: DatabaseCourse) => {
  return {
    courseCode: dbCourse.courseCode,
    courseName: dbCourse.courseName,
    instructor: dbCourse.instructor,
    credits: dbCourse.credits,
    majorDepartment: {
      departmentCode: dbCourse.majorDepartment.departmentCode,
      departmentName: dbCourse.majorDepartment.departmentName,
      headOfDepartment: dbCourse.majorDepartment.headOfDepartment
    },
    availableForSemester: dbCourse.availableForSemester,
    year: 2025, // Default year
    semester: 'Fall', // Default semester
    prerequisites: dbCourse.prerequisites,
    active: dbCourse.active || dbCourse.isActive || true
  };
};

class ApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        data,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false,
      };
    }
  }

  async getCourses(): Promise<ApiResponse<any[]>> {
    const response = await this.makeRequest<DatabaseCourse[]>('/courses');
    
    if (response.success && response.data) {
      // Transform database courses to frontend format
      const transformedCourses = response.data.map(transformCourseToClassData);
      return {
        data: transformedCourses,
        error: null,
        success: true,
      };
    }
    
    return response;
  }

  async getDepartments(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/departments');
  }

  async getStudents(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/students');
  }

  async getInstructors(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/instructors');
  }

  async getSections(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/sections');
  }

  async getEnrollments(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/enrollments');
  }
}

export const apiService = new ApiService(); 