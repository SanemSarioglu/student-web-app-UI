// API Service Layer - Clean Architecture
import { 
  ApiResponse, 
  Student, 
  Course, 
  Department, 
  Instructor, 
  Section, 
  Enrollment, 
  ClassData 
} from '../types/classData';

const API_BASE_URL = 'http://localhost:8080/api';

// Transform database course to frontend ClassData format
const transformCourseToClassData = (dbCourse: Course): ClassData => {
  return {
    courseCode: dbCourse.courseCode,
    courseName: dbCourse.courseName,
    instructor: dbCourse.instructor,
    credits: dbCourse.credits,
    majorDepartment: dbCourse.majorDepartment || {
      departmentCode: dbCourse.majorCode,
      departmentName: '',
      headOfDepartment: ''
    },
    availableForSemester: dbCourse.availableForSemester,
    year: 2025, // Default year
    semester: 'Fall', // Default semester
    prerequisites: dbCourse.prerequisites,
    active: dbCourse.isActive
  };
};

// Transform enrollment to ClassData format for enrolled classes
const transformEnrollmentToClassData = (enrollment: Enrollment): ClassData => {
  if (!enrollment.section?.course) {
    throw new Error('Enrollment missing section or course data');
  }

  const course = enrollment.section.course;
  const section = enrollment.section;

  return {
    courseCode: course.courseCode,
    courseName: course.courseName,
    instructor: course.instructor,
    credits: course.credits,
    majorDepartment: course.majorDepartment || {
      departmentCode: course.majorCode,
      departmentName: '',
      headOfDepartment: ''
    },
    availableForSemester: course.availableForSemester,
    year: section.year,
    semester: section.semester,
    prerequisites: course.prerequisites,
    active: course.isActive,
    grade: enrollment.grade,
    enrollmentStatus: enrollment.status
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
        const errorText = await response.text();
        return {
          data: null,
          error: `HTTP error! status: ${response.status}, message: ${errorText}`,
          success: false,
        };
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

  // Get all courses
  async getCourses(): Promise<ApiResponse<ClassData[]>> {
    const response = await this.makeRequest<Course[]>('/courses');
    
    if (response.success && response.data) {
      const transformedCourses = response.data.map(transformCourseToClassData);
      return {
        data: transformedCourses,
        error: null,
        success: true,
      };
    }
    
    return response;
  }

  // Get all students
  async getStudents(): Promise<ApiResponse<Student[]>> {
    return this.makeRequest<Student[]>('/students');
  }

  // Get all departments
  async getDepartments(): Promise<ApiResponse<Department[]>> {
    return this.makeRequest<Department[]>('/departments');
  }

  // Get all instructors
  async getInstructors(): Promise<ApiResponse<Instructor[]>> {
    return this.makeRequest<Instructor[]>('/instructors');
  }

  // Get all sections
  async getSections(): Promise<ApiResponse<Section[]>> {
    return this.makeRequest<Section[]>('/sections');
  }

  // Get all enrollments
  async getEnrollments(): Promise<ApiResponse<Enrollment[]>> {
    return this.makeRequest<Enrollment[]>('/enrollment');
  }

  // Get enrollments for a specific student
  async getStudentEnrollments(studentId: number): Promise<ApiResponse<ClassData[]>> {
    const response = await this.makeRequest<Enrollment[]>('/enrollment');
    
    if (response.success && response.data) {
      // Filter enrollments for the specific student
      const studentEnrollments = response.data.filter(
        enrollment => enrollment.studentId === studentId
      );
      
      // Transform to ClassData format
      const transformedEnrollments = studentEnrollments.map(transformEnrollmentToClassData);
      
      return {
        data: transformedEnrollments,
        error: null,
        success: true,
      };
    }
    
    return response;
  }

  // Get grades for a specific student
  async getStudentGrades(studentId: number): Promise<ApiResponse<{[courseCode: string]: string}>> {
    const response = await this.makeRequest<Enrollment[]>('/enrollment');
    
    if (response.success && response.data) {
      // Filter enrollments for the specific student and extract grades
      const studentGrades: {[courseCode: string]: string} = {};
      
      response.data
        .filter(enrollment => enrollment.studentId === studentId)
        .forEach(enrollment => {
          if (enrollment.section?.course && enrollment.grade) {
            studentGrades[enrollment.section.course.courseCode] = enrollment.grade;
          }
        });
      
      return {
        data: studentGrades,
        error: null,
        success: true,
      };
    }
    
    return response;
  }

  // Get a specific student by ID
  async getStudent(studentId: number): Promise<ApiResponse<Student>> {
    return this.makeRequest<Student>(`/students/${studentId}`);
  }

  // Get a specific course by code
  async getCourse(courseCode: string): Promise<ApiResponse<Course>> {
    return this.makeRequest<Course>(`/courses/${courseCode}`);
  }
}

export const apiService = new ApiService(); 