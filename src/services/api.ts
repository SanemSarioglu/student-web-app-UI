// API Service Layer - Clean Architecture
import { 
  ApiResponse 
} from '../types/api';
import { 
  Student, 
  Course, 
  Department, 
  Instructor, 
  Section, 
  Enrollment 
} from '../types/entities';
import {
  ClassData,
  GradeData
} from '../types/ui';

const API_BASE_URL = 'http://localhost:8080/api';

// Transform database course to frontend ClassData format
const transformCourseToClassData = (dbCourse: Course): ClassData => {
  return {
    courseCode: dbCourse.courseCode,
    courseName: dbCourse.courseName,
    instructor: dbCourse.instructor,
    credits: dbCourse.credits,
    majorDepartment: dbCourse.majorDepartment || {
      departmentCode: dbCourse.majorCode || '',
      departmentName: '',
      headOfDepartment: ''
    },
    availableForSemester: dbCourse.availableForSemester,
    year: 2025, // Default year
    semester: 'Fall', // Default semester
    prerequisites: dbCourse.prerequisites,
    active: dbCourse.isActive,
    sectionId: undefined // Courses don't have sectionId, only enrollments do
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
      departmentCode: course.majorCode || '',
      departmentName: '',
      headOfDepartment: ''
    },
    availableForSemester: course.availableForSemester,
    year: section.year,
    semester: section.semester,
    prerequisites: course.prerequisites,
    active: course.isActive,
    grade: enrollment.grade,
    enrollmentStatus: enrollment.status,
    sectionId: section.sectionId // Include sectionId for enrollment operations
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

      // Handle empty responses (like DELETE endpoints that return 204 No Content)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {
          data: null as T,
          error: null,
          success: true,
        };
      }

      // Try to parse JSON, but handle cases where response might be empty
      let data: T;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If JSON parsing fails, it might be an empty response
        if (response.status === 200) {
          return {
            data: null as T,
            error: null,
            success: true,
          };
        }
        throw jsonError;
      }

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
    
    return {
      data: null,
      error: response.error,
      success: false,
    };
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
        enrollment => enrollment.student?.id === studentId
      );
      
      // Transform to ClassData format
      const transformedEnrollments = studentEnrollments.map(transformEnrollmentToClassData);
      
      // Remove duplicates by course code (keep the most recent one)
      const uniqueEnrollments = transformedEnrollments.reduce((acc, current) => {
        const existingIndex = acc.findIndex(item => item.courseCode === current.courseCode);
        if (existingIndex === -1) {
          acc.push(current);
        } else {
          // Keep the one with the higher year, or if same year, keep the one with 'Spring' over 'Fall'
          const existing = acc[existingIndex];
          if (current.year > existing.year || 
              (current.year === existing.year && current.semester === 'Spring' && existing.semester === 'Fall')) {
            acc[existingIndex] = current;
          }
        }
        return acc;
      }, [] as ClassData[]);
      
      return {
        data: uniqueEnrollments,
        error: null,
        success: true,
      };
    }
    
    return {
      data: null,
      error: response.error,
      success: false,
    };
  }

  // Get all enrollments for a specific student (for grades page - no deduplication)
  async getAllStudentEnrollments(studentId: number): Promise<ApiResponse<ClassData[]>> {
    const response = await this.makeRequest<Enrollment[]>('/enrollment');
    
    if (response.success && response.data) {
      // Filter enrollments for the specific student
      const studentEnrollments = response.data.filter(
        enrollment => enrollment.student?.id === studentId
      );
      
      // Transform to ClassData format (no deduplication)
      const transformedEnrollments = studentEnrollments.map(transformEnrollmentToClassData);
      
      return {
        data: transformedEnrollments,
        error: null,
        success: true,
      };
    }
    
    return {
      data: null,
      error: response.error,
      success: false,
    };
  }

  // Get grades for a specific student
  async getStudentGrades(studentId: number): Promise<ApiResponse<{[courseCode: string]: GradeData}>> {
    const response = await this.makeRequest<Enrollment[]>('/enrollment');
    
    if (response.success && response.data) {
      // Filter enrollments for the specific student and extract grades
      const studentGrades: {[courseCode: string]: GradeData} = {};
      
      // Sort enrollments by year and semester to get the most recent ones
      const sortedEnrollments = response.data
        .filter(enrollment => enrollment.student?.id === studentId)
        .sort((a, b) => {
          // Sort by year first (descending)
          if (a.section?.year !== b.section?.year) {
            return (b.section?.year || 0) - (a.section?.year || 0);
          }
          // If same year, Spring comes after Fall
          if (a.section?.semester === 'Spring' && b.section?.semester === 'Fall') return -1;
          if (a.section?.semester === 'Fall' && b.section?.semester === 'Spring') return 1;
          return 0;
        });
      
      sortedEnrollments.forEach(enrollment => {
        if (enrollment.section?.course && enrollment.grade) {
          const courseCode = enrollment.section.course.courseCode;
          const gradeValue = parseFloat(enrollment.grade);
          
          // Only add if we haven't seen this course code yet (most recent will be first)
          if (!studentGrades[courseCode]) {
            // Convert simple grade to detailed format expected by frontend
            // Ensure all values are numbers, not objects
            const gradeData = {
              midterm: Number(gradeValue),
              project: Number(gradeValue),
              final: Number(gradeValue),
              quizzes: Number(gradeValue)
            };
            
            studentGrades[courseCode] = gradeData;
          }
        }
      });
      
      return {
        data: studentGrades,
        error: null,
        success: true,
      };
    }
    
    return {
      data: null,
      error: response.error,
      success: false,
    };
  }

  // Get a specific student by ID
  async getStudent(studentId: number): Promise<ApiResponse<Student>> {
    return this.makeRequest<Student>(`/students/${studentId}`);
  }

  // Get courses with their actual section information
  async getCoursesWithSections(): Promise<ApiResponse<ClassData[]>> {
    const [coursesResponse, sectionsResponse] = await Promise.all([
      this.makeRequest<Course[]>('/courses'),
      this.makeRequest<Section[]>('/sections')
    ]);
    
    if (coursesResponse.success && coursesResponse.data && 
        sectionsResponse.success && sectionsResponse.data) {
      
      const transformedCourses: ClassData[] = [];
      
      coursesResponse.data.forEach(course => {
        // Find all sections for this course
        const courseSections = sectionsResponse.data.filter(section => 
          section.course?.courseCode === course.courseCode
        );
        
        if (courseSections.length > 0) {
          // Create a ClassData entry for each section
          courseSections.forEach(section => {
            transformedCourses.push({
              courseCode: course.courseCode,
              courseName: course.courseName,
              instructor: section.instructor ? `${section.instructor.firstName} ${section.instructor.lastName}` : 'TBD',
              credits: course.credits,
              majorDepartment: course.majorDepartment || {
                departmentCode: course.majorCode || '',
                departmentName: '',
                headOfDepartment: ''
              },
              availableForSemester: course.availableForSemester,
              year: section.year,
              semester: section.semester,
              prerequisites: course.prerequisites,
              active: course.isActive,
              sectionId: section.sectionId // Include the actual sectionId
            });
          });
        } else {
          // Fallback for courses without sections (shouldn't happen in practice)
          transformedCourses.push({
            courseCode: course.courseCode,
            courseName: course.courseName,
            instructor: 'TBD',
            credits: course.credits,
            majorDepartment: course.majorDepartment || {
              departmentCode: course.majorCode || '',
              departmentName: '',
              headOfDepartment: ''
            },
            availableForSemester: course.availableForSemester,
            year: 2024, // Default fallback
            semester: 'Fall', // Default fallback
            prerequisites: course.prerequisites,
            active: course.isActive,
            sectionId: undefined
          });
        }
      });
      
      return {
        data: transformedCourses,
        error: null,
        success: true,
      };
    }
    
    return {
      data: null,
      error: coursesResponse.error || sectionsResponse.error,
      success: false,
    };
  }

  // Get a specific course by code
  async getCourse(courseCode: string): Promise<ApiResponse<Course>> {
    return this.makeRequest<Course>(`/courses/${courseCode}`);
  }

  // Create a new enrollment
  async createEnrollment(studentId: number, sectionId: number): Promise<ApiResponse<Enrollment>> {
    const enrollmentData = {
      student: { id: studentId },
      section: { sectionId: sectionId },
      status: 'current',
      enrollmentDate: new Date().toISOString()
    };

    return this.makeRequest<Enrollment>('/enrollment', {
      method: 'POST',
      body: JSON.stringify(enrollmentData)
    });
  }

  // Delete an enrollment
  async deleteEnrollment(enrollmentId: number): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/enrollment/${enrollmentId}`, {
      method: 'DELETE'
    });
  }

  // Get enrollment by student and section
  async getEnrollmentByStudentAndSection(studentId: number, sectionId: number): Promise<ApiResponse<Enrollment | null>> {
    const response = await this.makeRequest<Enrollment[]>('/enrollment');
    
    if (response.success && response.data) {
      const enrollment = response.data.find(
        e => e.student?.id === studentId && e.section?.sectionId === sectionId
      );
      
      return {
        data: enrollment || null,
        error: null,
        success: true,
      };
    }
    
    return {
      data: null,
      error: response.error,
      success: false,
    };
  }
}

export const apiService = new ApiService(); 