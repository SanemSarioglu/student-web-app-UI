import { GradeData } from '../types/ui';

// Helper to calculate overall grade from sub-grades (midterm, project, final, quizzes)
export const calculateOverallCourseGrade = (gradesObject: GradeData | undefined): number | string => {
  if (!gradesObject) return 'N/A';
  const { midterm, project, final, quizzes } = gradesObject;
  // Filter valid numerical grades
  const validGrades = [midterm, project, final, quizzes].filter(g => typeof g === 'number');

  if (validGrades.length === 0) return 'N/A';
  const sum = validGrades.reduce((acc, curr) => acc + (curr as number), 0);
  // Return a number for calculations
  return parseFloat((sum / validGrades.length).toFixed(2));
};

// Helper function for grade color class
export const getGradeColorClass = (grade: number | string): string => {
  if (typeof grade !== 'number') return 'bg-gray-100 text-gray-600'; // For 'N/A' or invalid grades

  if (grade >= 5.5) return 'bg-green-200 text-green-800'; // 6
  if (grade >= 4.5) return 'bg-lime-100 text-lime-700';   // 5
  if (grade >= 3.5) return 'bg-blue-100 text-blue-700';   // 4
  if (grade >= 2.5) return 'bg-yellow-100 text-yellow-700'; // 3
  if (grade >= 1.5) return 'bg-orange-100 text-orange-700'; // 2
  if (grade >= 1) return 'bg-red-100 text-red-700';     // 1
  return 'bg-gray-100 text-gray-600'; // Default fallback
};

// Helper function to convert semester level string (e.g., 'BA1') to an integer for comparison
export const getSemesterLevelValue = (level: string): number => {
  if (!level) return 0;
  const match = level.match(/BA(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}; 