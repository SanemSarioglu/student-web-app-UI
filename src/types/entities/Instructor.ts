import { Department } from './Department';

// Instructor entity type
export interface Instructor {
  instructorId: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentCode: string;
  department?: Department; // Optional for when department is loaded
} 