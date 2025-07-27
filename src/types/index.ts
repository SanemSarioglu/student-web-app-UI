export interface Course {
  id: string;
  code?: string;
  name: string;
  description: string;
  professor: string;
  credits: number;
  department: string;
  semester: Semester;
  level: string; // BA1, BA2, etc.
  semesterLevel?: string; // Alternative property name
  year?: number;
  isRegistered?: boolean;
  assignments?: unknown[];
}

export interface Grade {
  courseId: string;
  courseName: string;
  grade: number; // 1-6 scale
  semester: Semester;
  year: number;
}

export interface SubGrades {
  midterm: number | 'N/A';
  project: number | 'N/A';
  final: number | 'N/A';
  quizzes: number | 'N/A';
}

export interface Semester {
  year: number;
  term: 'Spring' | 'Fall' | 'Summer';
}

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department?: string;
  semesterLevel?: string;
  currentSemester?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface CourseLevel {
  id: string;
  name: string;
  code: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
} 