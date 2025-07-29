import { Department } from './Department';

// Course entity type
export interface Course {
  courseCode: string;
  courseName: string;
  credits: number;
  prerequisites: string;
  isActive: boolean;
  majorCode: string;
  availableForSemester: string;
  instructor: string;
  majorDepartment?: Department; // Optional for when department is loaded
} 