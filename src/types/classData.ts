// Complete TypeScript types matching your database schema

// Department entity
export interface Department {
  departmentCode: string;
  departmentName: string;
  headOfDepartment: string;
}

// Student entity
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  semester: string;
  departmentCode: string;
  department?: Department; // Optional for when department is loaded
}

// Instructor entity
export interface Instructor {
  instructorId: number;
  firstName: string;
  lastName: string;
  email: string;
  departmentCode: string;
  department?: Department; // Optional for when department is loaded
}

// Course entity
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

// Section entity
export interface Section {
  sectionId: number;
  courseCode: string;
  semester: string;
  year: number;
  instructorId: number;
  capacity: number;
  currentEnrollment: number;
  status: string;
  sectionNumber: string;
  course?: Course; // Optional for when course is loaded
  instructor?: Instructor; // Optional for when instructor is loaded
}

// Enrollment entity
export interface Enrollment {
  enrollementId: number;
  studentId: number;
  sectionId: number;
  grade: string;
  status: string;
  enrollmentDate: string;
  student?: Student; // Optional for when student is loaded
  section?: Section; // Optional for when section is loaded
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Frontend specific types for UI components
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

// Grade related types
export interface GradeData {
  midterm: number | string;
  project: number | string;
  final: number | string;
  quizzes: number | string;
}

export interface Grades {
  [key: string]: GradeData;
}

// Student selection and authentication types
export interface StudentLogin {
  studentId: number;
  firstName: string;
  lastName: string;
  department: Department;
  semester: string;
}

// Dashboard specific types
export interface DashboardData {
  selectedStudent: Student | null;
  availableClasses: ClassData[];
  registeredClasses: ClassData[];
  grades: Grades;
}

// Navigation types
export type ViewType = 'dashboard' | 'myClasses' | 'myGrades' | 'classDetails' | 'classesList';

// Modal and notification types
export interface ModalState {
  isOpen: boolean;
  message: string;
  onConfirm: (() => void) | null;
}

export interface NotificationState {
  message: string;
  show: boolean;
} 