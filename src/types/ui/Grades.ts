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