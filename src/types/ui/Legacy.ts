// Legacy types that were in the old classData.ts but are still needed

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department?: string;
  semesterLevel?: string;
  currentSemester?: string;
}

export interface CourseLevel {
  id: string;
  name: string;
  code: string;
}

export interface Semester {
  year: number;
  term: 'Spring' | 'Fall' | 'Summer';
}

export interface SubGrades {
  midterm: number | 'N/A';
  project: number | 'N/A';
  final: number | 'N/A';
  quizzes: number | 'N/A';
} 