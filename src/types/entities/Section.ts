import { Course } from './Course';
import { Instructor } from './Instructor';

// Section entity type
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