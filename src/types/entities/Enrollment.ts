import { Student } from './Student';
import { Section } from './Section';

// Enrollment entity type
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