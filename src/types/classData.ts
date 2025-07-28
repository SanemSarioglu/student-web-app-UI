// Shared types for class data across all pages
export interface ClassData {
  courseCode: string;
  courseName: string;
  credits: number;
  prerequisites: string;
  majorDepartment: {
    departmentCode: string;
    departmentName: string;
    headOfDepartment: string;
  };
  availableForSemester: string;
  instructor: string;
  active: boolean;
  // Keep legacy fields for backward compatibility with existing mock data
  id?: string;
  name?: string;
  professor?: string;
  department?: string;
  semesterLevel?: string;
  year?: number;
  semester?: string;
  description?: string;
  assignments?: any[];
}

export interface GradeData {
  midterm: number | string;
  project: number | string;
  final: number | string;
  quizzes: number | string;
}

export interface Grades {
  [key: string]: GradeData;
} 