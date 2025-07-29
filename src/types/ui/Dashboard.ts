import { Student } from '../entities/Student';
import { ClassData } from './ClassData';
import { Grades } from './Grades';

// Dashboard specific types
export interface DashboardData {
  selectedStudent: Student | null;
  availableClasses: ClassData[];
  registeredClasses: ClassData[];
  grades: Grades;
}

// Student selection and authentication types
export interface StudentLogin {
  studentId: number;
  firstName: string;
  lastName: string;
  department: import('../entities/Department').Department;
  semester: string;
} 