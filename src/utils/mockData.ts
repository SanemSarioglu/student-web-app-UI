import { Course, Department, CourseLevel, User, SubGrades } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Alice Smith',
  email: 'alice.smith@university.edu',
  studentId: 'STU2025001',
  department: 'CS',
  semesterLevel: 'BA3',
  currentSemester: 'Fall 2025'
};

export const mockDepartments: Department[] = [
  { id: '1', name: 'Computer Science', code: 'CS' },
  { id: '2', name: 'Mathematics', code: 'MATH' },
  { id: '3', name: 'Physics', code: 'PHYS' },
  { id: '4', name: 'Economics', code: 'ECON' },
  { id: '5', name: 'Literature', code: 'LIT' },
  { id: '6', name: 'History', code: 'HIST' },
  { id: '7', name: 'Biology', code: 'BIO' },
  { id: '8', name: 'Chemistry', code: 'CHEM' },
  { id: '9', name: 'Electrical Engineering', code: 'ELEC' }
];

export const mockCourseLevels: CourseLevel[] = [
  { id: '1', name: 'Bachelor Year 1', code: 'BA1' },
  { id: '2', name: 'Bachelor Year 2', code: 'BA2' },
  { id: '3', name: 'Bachelor Year 3', code: 'BA3' },
  { id: '4', name: 'Bachelor Year 4', code: 'BA4' },
  { id: '5', name: 'Master Year 1', code: 'MA1' },
  { id: '6', name: 'Master Year 2', code: 'MA2' }
];

export const mockCourses: Course[] = [
  // BA1 - 2023
  { 
    id: 'hist101', 
    name: 'Intro to History', 
    professor: 'Prof. Miller', 
    credits: 3, 
    department: 'HIST', 
    semesterLevel: 'BA1', 
    year: 2023, 
    semester: { year: 2023, term: 'Fall' },
    level: 'BA1',
    description: 'A survey of major historical events.',
    isRegistered: true
  },
  { 
    id: 'lit101', 
    name: 'World Literature', 
    professor: 'Dr. Kim', 
    credits: 3, 
    department: 'LIT', 
    semesterLevel: 'BA1', 
    year: 2023, 
    semester: { year: 2023, term: 'Fall' },
    level: 'BA1',
    description: 'Exploring literary works from around the globe.',
    isRegistered: true
  },
  // BA1 - 2024
  { 
    id: 'math101', 
    name: 'Calculus I', 
    description: 'Introduction to differential and integral calculus.', 
    professor: 'Dr. Emily White', 
    credits: 3, 
    department: 'MATH', 
    semesterLevel: 'BA1', 
    year: 2024, 
    semester: { year: 2024, term: 'Spring' },
    level: 'BA1',
    isRegistered: true
  },
  { 
    id: 'phy101', 
    name: 'Physics I', 
    description: 'Classical mechanics and thermodynamics.', 
    professor: 'Dr. Robert Green', 
    credits: 3, 
    department: 'PHYS', 
    semesterLevel: 'BA1', 
    year: 2024, 
    semester: { year: 2024, term: 'Spring' },
    level: 'BA1',
    isRegistered: true
  },
  // BA2 - 2024
  { 
    id: 'math201', 
    name: 'Linear Algebra', 
    professor: 'Dr. Sarah Davis', 
    credits: 3, 
    department: 'MATH', 
    semesterLevel: 'BA2', 
    year: 2024, 
    semester: { year: 2024, term: 'Fall' },
    level: 'BA2',
    description: 'Study of vectors, matrices, and linear transformations.',
    isRegistered: true
  },
  { 
    id: 'bio201', 
    name: 'General Biology', 
    professor: 'Prof. Jane Smith', 
    credits: 3, 
    department: 'BIO', 
    semesterLevel: 'BA2', 
    year: 2024, 
    semester: { year: 2024, term: 'Fall' },
    level: 'BA2',
    description: 'Fundamental concepts of biology.',
    isRegistered: true
  },
  // BA2 - 2025 (Previous Semester)
  { 
    id: 'cs202', 
    name: 'Operating Systems', 
    professor: 'Dr. Alan Grant', 
    credits: 4, 
    department: 'CS', 
    semesterLevel: 'BA2', 
    year: 2025, 
    semester: { year: 2025, term: 'Spring' },
    level: 'BA2',
    description: 'Core concepts of modern operating systems.',
    isRegistered: true
  },
  { 
    id: 'phys201', 
    name: 'Electromagnetism', 
    description: 'Principles of electricity and magnetism.', 
    professor: 'Dr. Chris Wilson', 
    credits: 3, 
    department: 'PHYS', 
    semesterLevel: 'BA2', 
    year: 2025, 
    semester: { year: 2025, term: 'Spring' },
    level: 'BA2',
    isRegistered: true
  },
  { 
    id: 'elec301', 
    name: 'Circuit Analysis', 
    description: 'Analysis of electrical circuits.', 
    professor: 'Dr. John Doe', 
    credits: 4, 
    department: 'ELEC', 
    semesterLevel: 'BA2', 
    year: 2025, 
    semester: { year: 2025, term: 'Spring' },
    level: 'BA2',
    isRegistered: true
  },
  { 
    id: 'chem201', 
    name: 'Organic Chemistry', 
    description: 'Structure, properties, and reactions of organic compounds.', 
    professor: 'Dr. Walter White', 
    credits: 3, 
    department: 'CHEM', 
    semesterLevel: 'BA2', 
    year: 2025, 
    semester: { year: 2025, term: 'Spring' },
    level: 'BA2',
    isRegistered: true
  },
  // BA3 - 2025 (Current Semester - Ongoing)
  { 
    id: 'cs301', 
    name: 'Algorithms', 
    professor: 'Prof. Mark Johnson', 
    credits: 4, 
    department: 'CS', 
    semesterLevel: 'BA3', 
    year: 2025, 
    semester: { year: 2025, term: 'Fall' },
    level: 'BA3',
    description: 'Design and analysis of algorithms.',
    isRegistered: true
  },
  { 
    id: 'bio301', 
    name: 'Genetics', 
    professor: 'Prof. Laura Martinez', 
    credits: 4, 
    department: 'BIO', 
    semesterLevel: 'BA3', 
    year: 2025, 
    semester: { year: 2025, term: 'Fall' },
    level: 'BA3',
    description: 'Principles of heredity and variation.',
    isRegistered: true
  },
  // Other available classes
  { 
    id: 'cs401', 
    name: 'Machine Learning', 
    description: 'Introduction to machine learning algorithms and applications.', 
    professor: 'Dr. Elena Rodriguez', 
    credits: 4, 
    department: 'CS', 
    semesterLevel: 'BA4', 
    year: 2026, 
    semester: { year: 2026, term: 'Spring' },
    level: 'BA4',
    isRegistered: false
  },
];

export const mockGrades: Record<string, SubGrades> = {
  // Past grades
  'hist101': { midterm: 4, project: 5, final: 4, quizzes: 4 },
  'lit101': { midterm: 5, project: 5, final: 5, quizzes: 6 },
  'math101': { midterm: 4, project: 4, final: 5, quizzes: 4 },
  'phy101': { midterm: 3, project: 4, final: 3, quizzes: 4 },
  'math201': { midterm: 3, project: 3, final: 4, quizzes: 3 },
  'bio201': { midterm: 4, project: 4, final: 5, quizzes: 4 },
  'cs202': { midterm: 5, project: 4, final: 5, quizzes: 5 },
  'phys201': { midterm: 4, project: 5, final: 4, quizzes: 4 },
  'elec301': { midterm: 3, project: 4, final: 3, quizzes: 3 },
  'chem201': { midterm: 5, project: 5, final: 6, quizzes: 5 },
  // Current semester - NO GRADES YET
  'cs301': { midterm: 'N/A', project: 'N/A', final: 'N/A', quizzes: 'N/A' },
  'bio301': { midterm: 'N/A', project: 'N/A', final: 'N/A', quizzes: 'N/A' },
};

export const getCurrentSemester = () => ({ year: 2025, term: 'Fall' as const });
export const getPreviousSemester = () => ({ year: 2025, term: 'Spring' as const }); 