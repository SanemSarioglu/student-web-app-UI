import { Department } from '../entities/Department';

// Frontend specific type for UI components
export interface ClassData {
  courseCode: string;
  courseName: string;
  instructor: string;
  credits: number;
  majorDepartment: Department;
  availableForSemester: string;
  year: number;
  semester: string;
  prerequisites: string;
  active: boolean;
  description?: string; // Optional, as it's not in DB schema but was in mock data
  grade?: string; // For enrolled classes
  enrollmentStatus?: string; // For enrolled classes
  assignments?: {
    midterm: string | number;
    project: string | number;
    final: string | number;
    quizzes: string | number;
  }[]; // For grades, if needed
} 