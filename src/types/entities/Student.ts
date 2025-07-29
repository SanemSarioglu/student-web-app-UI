import { Department } from './Department';

// Student entity type
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  semester: string;
  departmentCode: string;
  department?: Department; // Optional for when department is loaded
} 