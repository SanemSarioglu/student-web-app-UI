import React, { useState, useEffect, useRef } from 'react';
import { apiService } from './services/api';
import { ClassData, Grades } from './types/classData';
import { calculateOverallCourseGrade, getGradeColorClass, getSemesterLevelValue } from './utils/gradeUtils';
import Dashboard from './pages/Dashboard';
import CourseCatalog from './pages/CourseCatalog';
import MyClasses from './pages/MyClasses';
import MyGrades from './pages/MyGrades';

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
}



// Main App component
const App = () => {
  // State to manage the current view: 'dashboard', 'myClasses', 'myGrades', 'classDetails', 'classesList'
  const [currentView, setCurrentView] = useState<'dashboard' | 'myClasses' | 'myGrades' | 'classDetails' | 'classesList'>('dashboard'); // Default view is now dashboard
  // State to store available classes
  const [availableClasses, setAvailableClasses] = useState<ClassData[]>([]);
  // State to store classes the student is registered for
  const [registeredClasses, setRegisteredClasses] = useState<ClassData[]>([]);
  // State to store grades for registered classes (now an object with sub-grades and overall)
  const [grades, setGrades] = useState<Grades>({});
  // State to store the details of the currently selected class
  const [selectedClassDetails, setSelectedClassDetails] = useState<ClassData | null>(null);

  // New states for student information - Updated for logical progression
  const [studentName] = useState<string>('Alice Smith'); // Mock student name
  const [studentDepartment] = useState<string>('CS'); // Mock student department
  const [studentSemesterLevel] = useState<string>('BA3'); // Mock student semester level
  const [currentSemester] = useState<string>('Fall 2025'); // Mock current semester

  // State for confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [confirmMessage, setConfirmMessage] = useState<string>('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  // State for transient notification
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null); // To clear previous timeouts

  // Function to show a confirmation dialog
  const showConfirmation = (message: string, callback: () => void) => {
    setConfirmMessage(message);
    setOnConfirmCallback(() => callback); // Store the callback
    setIsConfirmModalOpen(true);
  };

  // Function to show a transient notification
  const showTransientNotification = (message: string) => {
    // Clear any existing notification timeout
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotificationMessage(message);
    setShowNotification(true);
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage('');
    }, 3000); // Disappear after 3 seconds
  };

  // Handles confirmation action
  const handleConfirmAction = () => {
    setIsConfirmModalOpen(false); // Close confirm modal
    if (onConfirmCallback) {
      onConfirmCallback(); // Execute the stored action
    }
  };

  // Handles cancellation of confirmation
  const handleCancelAction = () => {
    setIsConfirmModalOpen(false);
    setOnConfirmCallback(null); // Clear the callback
  };

  // Fetch data from backend
  useEffect(() => {
    // Fetch courses from backend using clean architecture
    const fetchCourses = async () => {
      const response = await apiService.getCourses();
      
      if (response.success && response.data) {
        setAvailableClasses(response.data);
        console.log('Successfully fetched courses from database:', response.data);
        
        // Set up some registered classes from the database courses
        const databaseCourses = response.data;
        const registeredCourses = [
          databaseCourses.find(c => c.courseCode === 'CS112'),
          databaseCourses.find(c => c.courseCode === 'CS201'),
          databaseCourses.find(c => c.courseCode === 'MATH100'),
          databaseCourses.find(c => c.courseCode === 'PHYS100'),
          databaseCourses.find(c => c.courseCode === 'BIO-204'),
          databaseCourses.find(c => c.courseCode === 'CS202'),
          databaseCourses.find(c => c.courseCode === 'CS301'),
          databaseCourses.find(c => c.courseCode === 'SV101'),
          databaseCourses.find(c => c.courseCode === 'MECA110'),
          databaseCourses.find(c => c.courseCode === 'ELEC101'),
          databaseCourses.find(c => c.courseCode === 'MATH110'),
          databaseCourses.find(c => c.courseCode === 'PHYS105'),
        ].filter(Boolean).map(cls => ({ ...cls, assignments: [] }));
        
        setRegisteredClasses(registeredCourses);
      } else {
        console.warn('Failed to fetch courses:', response.error);
        // Fallback to mock data if API fails
        const allCourses: ClassData[] = [
          // BA1 - 2023
          { 
            courseCode: 'hist101', 
            courseName: 'Intro to History', 
            instructor: 'Prof. Miller', 
            credits: 3, 
            majorDepartment: { departmentCode: 'HIST', departmentName: 'History', headOfDepartment: 'Prof. Miller' },
            availableForSemester: 'BA1', 
            year: 2023, 
            semester: 'Fall', 
            prerequisites: 'NONE',
            active: true,
            description: 'A survey of major historical events.' 
          },
          { 
            courseCode: 'lit101', 
            courseName: 'World Literature', 
            instructor: 'Dr. Kim', 
            credits: 3, 
            majorDepartment: { departmentCode: 'LIT', departmentName: 'Literature', headOfDepartment: 'Dr. Kim' },
            availableForSemester: 'BA1', 
            year: 2023, 
            semester: 'Fall', 
            prerequisites: 'NONE',
            active: true,
            description: 'Exploring literary works from around the globe.' 
          },
          // BA1 - 2024
          { 
            courseCode: 'math101', 
            courseName: 'Calculus I', 
            description: 'Introduction to differential and integral calculus.', 
            instructor: 'Dr. Emily White', 
            credits: 3, 
            majorDepartment: { departmentCode: 'MATH', departmentName: 'Mathematics', headOfDepartment: 'Dr. Emily White' },
            availableForSemester: 'BA1', 
            year: 2024, 
            semester: 'Spring',
            prerequisites: 'NONE',
            active: true
          },
          { 
            courseCode: 'phy101', 
            courseName: 'Physics I', 
            description: 'Classical mechanics and thermodynamics.', 
            instructor: 'Dr. Robert Green', 
            credits: 3, 
            majorDepartment: { departmentCode: 'PHYS', departmentName: 'Physics', headOfDepartment: 'Dr. Robert Green' },
            availableForSemester: 'BA1', 
            year: 2024, 
            semester: 'Spring',
            prerequisites: 'NONE',
            active: true
          },
          // BA2 - 2024
          { 
            courseCode: 'math201', 
            courseName: 'Linear Algebra', 
            instructor: 'Dr. Sarah Davis', 
            credits: 3, 
            majorDepartment: { departmentCode: 'MATH', departmentName: 'Mathematics', headOfDepartment: 'Dr. Sarah Davis' },
            availableForSemester: 'BA2', 
            year: 2024, 
            semester: 'Fall', 
            prerequisites: 'math101',
            active: true,
            description: 'Study of vectors, matrices, and linear transformations.' 
          },
          { 
            courseCode: 'bio201', 
            courseName: 'General Biology', 
            instructor: 'Prof. Jane Smith', 
            credits: 3, 
            majorDepartment: { departmentCode: 'BIO', departmentName: 'Biology', headOfDepartment: 'Prof. Jane Smith' },
            availableForSemester: 'BA2', 
            year: 2024, 
            semester: 'Fall', 
            prerequisites: 'NONE',
            active: true,
            description: 'Fundamental concepts of biology.' 
          },
          // BA2 - 2025 (Previous Semester)
          { 
            courseCode: 'cs202', 
            courseName: 'Operating Systems', 
            instructor: 'Dr. Alan Grant', 
            credits: 4, 
            majorDepartment: { departmentCode: 'CS', departmentName: 'Computer Science', headOfDepartment: 'Dr. Alan Grant' },
            availableForSemester: 'BA2', 
            year: 2025, 
            semester: 'Spring', 
            prerequisites: 'cs101',
            active: true,
            description: 'Core concepts of modern operating systems.' 
          },
          { 
            courseCode: 'phys201', 
            courseName: 'Electromagnetism', 
            description: 'Principles of electricity and magnetism.', 
            instructor: 'Dr. Chris Wilson', 
            credits: 3, 
            majorDepartment: { departmentCode: 'PHYS', departmentName: 'Physics', headOfDepartment: 'Dr. Chris Wilson' },
            availableForSemester: 'BA2', 
            year: 2025, 
            semester: 'Spring',
            prerequisites: 'phy101',
            active: true
          },
          { 
            courseCode: 'elec301', 
            courseName: 'Circuit Analysis', 
            description: 'Analysis of electrical circuits.', 
            instructor: 'Dr. John Doe', 
            credits: 4, 
            majorDepartment: { departmentCode: 'ELEC', departmentName: 'Electrical Engineering', headOfDepartment: 'Dr. John Doe' },
            availableForSemester: 'BA2', 
            year: 2025, 
            semester: 'Spring',
            prerequisites: 'phy101',
            active: true
          },
          { 
            courseCode: 'chem201', 
            courseName: 'Organic Chemistry', 
            description: 'Structure, properties, and reactions of organic compounds.', 
            instructor: 'Dr. Walter White', 
            credits: 3, 
            majorDepartment: { departmentCode: 'CHEM', departmentName: 'Chemistry', headOfDepartment: 'Dr. Walter White' },
            availableForSemester: 'BA2', 
            year: 2025, 
            semester: 'Spring',
            prerequisites: 'chem101',
            active: true
          },
          // BA3 - 2025 (Current Semester - Ongoing)
          { 
            courseCode: 'cs301', 
            courseName: 'Algorithms', 
            instructor: 'Prof. Mark Johnson', 
            credits: 4, 
            majorDepartment: { departmentCode: 'CS', departmentName: 'Computer Science', headOfDepartment: 'Prof. Mark Johnson' },
            availableForSemester: 'BA3', 
            year: 2025, 
            semester: 'Fall', 
            prerequisites: 'cs202',
            active: true,
            description: 'Design and analysis of algorithms.' 
          },
          { 
            courseCode: 'bio301', 
            courseName: 'Genetics', 
            instructor: 'Prof. Laura Martinez', 
            credits: 4, 
            majorDepartment: { departmentCode: 'BIO', departmentName: 'Biology', headOfDepartment: 'Prof. Laura Martinez' },
            availableForSemester: 'BA3', 
            year: 2025, 
            semester: 'Fall', 
            prerequisites: 'bio201',
            active: true,
            description: 'Principles of heredity and variation.' 
          },
          // Other available classes
          { 
            courseCode: 'cs401', 
            courseName: 'Machine Learning', 
            description: 'Introduction to machine learning algorithms and applications.', 
            instructor: 'Dr. Elena Rodriguez', 
            credits: 4, 
            majorDepartment: { departmentCode: 'CS', departmentName: 'Computer Science', headOfDepartment: 'Dr. Elena Rodriguez' },
            availableForSemester: 'BA4', 
            year: 2026, 
            semester: 'Spring',
            prerequisites: 'cs301',
            active: true
          },
        ];
        setAvailableClasses(allCourses);
      }
    };

    fetchCourses();

    // The rest of your mock data logic for registeredClasses and grades remains unchanged for now
    const allCourses: ClassData[] = [
      // BA1 - 2023
      { 
        courseCode: 'hist101', 
        courseName: 'Intro to History', 
        instructor: 'Prof. Miller', 
        credits: 3, 
        majorDepartment: { departmentCode: 'HIST', departmentName: 'History', headOfDepartment: 'Prof. Miller' },
        availableForSemester: 'BA1', 
        year: 2023, 
        semester: 'Fall', 
        prerequisites: 'NONE',
        active: true,
        description: 'A survey of major historical events.' 
      },
      { 
        courseCode: 'lit101', 
        courseName: 'World Literature', 
        instructor: 'Dr. Kim', 
        credits: 3, 
        majorDepartment: { departmentCode: 'LIT', departmentName: 'Literature', headOfDepartment: 'Dr. Kim' },
        availableForSemester: 'BA1', 
        year: 2023, 
        semester: 'Fall', 
        prerequisites: 'NONE',
        active: true,
        description: 'Exploring literary works from around the globe.' 
      },
      // BA1 - 2024
      { 
        courseCode: 'math101', 
        courseName: 'Calculus I', 
        description: 'Introduction to differential and integral calculus.', 
        instructor: 'Dr. Emily White', 
        credits: 3, 
        majorDepartment: { departmentCode: 'MATH', departmentName: 'Mathematics', headOfDepartment: 'Dr. Emily White' },
        availableForSemester: 'BA1', 
        year: 2024, 
        semester: 'Spring',
        prerequisites: 'NONE',
        active: true
      },
      { 
        courseCode: 'phy101', 
        courseName: 'Physics I', 
        description: 'Classical mechanics and thermodynamics.', 
        instructor: 'Dr. Robert Green', 
        credits: 3, 
        majorDepartment: { departmentCode: 'PHYS', departmentName: 'Physics', headOfDepartment: 'Dr. Robert Green' },
        availableForSemester: 'BA1', 
        year: 2024, 
        semester: 'Spring',
        prerequisites: 'NONE',
        active: true
      },
      // BA2 - 2024
      { 
        courseCode: 'math201', 
        courseName: 'Linear Algebra', 
        instructor: 'Dr. Sarah Davis', 
        credits: 3, 
        majorDepartment: { departmentCode: 'MATH', departmentName: 'Mathematics', headOfDepartment: 'Dr. Sarah Davis' },
        availableForSemester: 'BA2', 
        year: 2024, 
        semester: 'Fall', 
        prerequisites: 'math101',
        active: true,
        description: 'Study of vectors, matrices, and linear transformations.' 
      },
      { 
        courseCode: 'bio201', 
        courseName: 'General Biology', 
        instructor: 'Prof. Jane Smith', 
        credits: 3, 
        majorDepartment: { departmentCode: 'BIO', departmentName: 'Biology', headOfDepartment: 'Prof. Jane Smith' },
        availableForSemester: 'BA2', 
        year: 2024, 
        semester: 'Fall', 
        prerequisites: 'NONE',
        active: true,
        description: 'Fundamental concepts of biology.' 
      },
      // BA2 - 2025 (Previous Semester)
      { 
        courseCode: 'cs202', 
        courseName: 'Operating Systems', 
        instructor: 'Dr. Alan Grant', 
        credits: 4, 
        majorDepartment: { departmentCode: 'CS', departmentName: 'Computer Science', headOfDepartment: 'Dr. Alan Grant' },
        availableForSemester: 'BA2', 
        year: 2025, 
        semester: 'Spring', 
        prerequisites: 'cs101',
        active: true,
        description: 'Core concepts of modern operating systems.' 
      },
      { 
        courseCode: 'phys201', 
        courseName: 'Electromagnetism', 
        description: 'Principles of electricity and magnetism.', 
        instructor: 'Dr. Chris Wilson', 
        credits: 3, 
        majorDepartment: { departmentCode: 'PHYS', departmentName: 'Physics', headOfDepartment: 'Dr. Chris Wilson' },
        availableForSemester: 'BA2', 
        year: 2025, 
        semester: 'Spring',
        prerequisites: 'phy101',
        active: true
      },
      { 
        courseCode: 'elec301', 
        courseName: 'Circuit Analysis', 
        description: 'Analysis of electrical circuits.', 
        instructor: 'Dr. John Doe', 
        credits: 4, 
        majorDepartment: { departmentCode: 'ELEC', departmentName: 'Electrical Engineering', headOfDepartment: 'Dr. John Doe' },
        availableForSemester: 'BA2', 
        year: 2025, 
        semester: 'Spring',
        prerequisites: 'phy101',
        active: true
      },
      { 
        courseCode: 'chem201', 
        courseName: 'Organic Chemistry', 
        description: 'Structure, properties, and reactions of organic compounds.', 
        instructor: 'Dr. Walter White', 
        credits: 3, 
        majorDepartment: { departmentCode: 'CHEM', departmentName: 'Chemistry', headOfDepartment: 'Dr. Walter White' },
        availableForSemester: 'BA2', 
        year: 2025, 
        semester: 'Spring',
        prerequisites: 'chem101',
        active: true
      },
      // BA3 - 2025 (Current Semester - Ongoing)
      { 
        courseCode: 'cs301', 
        courseName: 'Algorithms', 
        instructor: 'Prof. Mark Johnson', 
        credits: 4, 
        majorDepartment: { departmentCode: 'CS', departmentName: 'Computer Science', headOfDepartment: 'Prof. Mark Johnson' },
        availableForSemester: 'BA3', 
        year: 2025, 
        semester: 'Fall', 
        prerequisites: 'cs202',
        active: true,
        description: 'Design and analysis of algorithms.' 
      },
      { 
        courseCode: 'bio301', 
        courseName: 'Genetics', 
        instructor: 'Prof. Laura Martinez', 
        credits: 4, 
        majorDepartment: { departmentCode: 'BIO', departmentName: 'Biology', headOfDepartment: 'Prof. Laura Martinez' },
        availableForSemester: 'BA3', 
        year: 2025, 
        semester: 'Fall', 
        prerequisites: 'bio201',
        active: true,
        description: 'Principles of heredity and variation.' 
      },
      // Other available classes
      { 
        courseCode: 'cs401', 
        courseName: 'Machine Learning', 
        description: 'Introduction to machine learning algorithms and applications.', 
        instructor: 'Dr. Elena Rodriguez', 
        credits: 4, 
        majorDepartment: { departmentCode: 'CS', departmentName: 'Computer Science', headOfDepartment: 'Dr. Elena Rodriguez' },
        availableForSemester: 'BA4', 
        year: 2026, 
        semester: 'Spring',
        prerequisites: 'cs301',
        active: true
      },
    ];
    const studentRegisteredClasses: ClassData[] = [
        // Past semesters
        allCourses.find(c => c.courseCode === 'hist101')!,
        allCourses.find(c => c.courseCode === 'lit101')!,
        allCourses.find(c => c.courseCode === 'math101')!,
        allCourses.find(c => c.courseCode === 'phy101')!,
        allCourses.find(c => c.courseCode === 'math201')!,
        allCourses.find(c => c.courseCode === 'bio201')!,
        allCourses.find(c => c.courseCode === 'cs202')!,
        allCourses.find(c => c.courseCode === 'phys201')!,
        allCourses.find(c => c.courseCode === 'elec301')!,
        allCourses.find(c => c.courseCode === 'chem201')!,
        // Current semester (ongoing)
        allCourses.find(c => c.courseCode === 'cs301')!,
        allCourses.find(c => c.courseCode === 'bio301')!,
    ].map(cls => ({ ...cls, assignments: [] })); // Add assignments array
    setRegisteredClasses(studentRegisteredClasses);

    setGrades({
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
    });
  }, []);

  // Function to handle class registration
  const handleRegister = (classToRegister: ClassData) => {
    if (registeredClasses.some(cls => cls.courseCode === classToRegister.courseCode)) {
      showTransientNotification(`You are already registered for ${classToRegister.courseName}.`);
      return;
    }
    showConfirmation(`Are you sure you want to register for ${classToRegister.courseName}?`, () => {
      setRegisteredClasses(prev => [...prev, { ...classToRegister, assignments: [] }]); // Add assignments array
      setGrades(prev => ({
        ...prev,
        [classToRegister.courseCode]: { midterm: 'N/A', project: 'N/A', final: 'N/A', quizzes: 'N/A' }
      }));
      showTransientNotification(`Successfully registered for ${classToRegister.courseName}!`);
    });
  };

  // Function to handle class unregistration
  const handleUnregister = (classId: string) => {
    const classToUnregister = registeredClasses.find(cls => cls.courseCode === classId);
    if (!classToUnregister) return;

    showConfirmation(`Are you sure you want to unregister from ${classToUnregister.courseName}?`, () => {
      // Remove class from registeredClasses
      setRegisteredClasses(prev => prev.filter(cls => cls.courseCode !== classId));
      // Remove grades for that class
      setGrades(prev => {
        const newGrades = { ...prev };
        delete newGrades[classId];
        return newGrades;
      });
      showTransientNotification(`Successfully unregistered from ${classToUnregister.courseName}.`);
    });
  };

  // Function to handle viewing class details (still needed for MyClasses page)
  const handleViewClassDetails = (classObj: ClassData) => {
    setSelectedClassDetails(classObj);
    setCurrentView('classDetails');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-inter">
      <header className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Student Portal</h1>
        {/* Student information display */}
        <div className="text-center text-gray-700 mb-6">
          <p className="text-xl font-semibold">Welcome, {studentName}!</p>
          <p className="text-md">Department: {studentDepartment} | Semester: {currentSemester} ({studentSemesterLevel})</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => { setCurrentView('dashboard'); setSelectedClassDetails(null); }}
            className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300
              ${currentView === 'dashboard' ? 'bg-blue-600 text-white transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => { setCurrentView('classesList'); setSelectedClassDetails(null); }}
            className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300
              ${currentView === 'classesList' ? 'bg-blue-600 text-white transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
          >
            All Classes
          </button>
          <button
            onClick={() => { setCurrentView('myClasses'); setSelectedClassDetails(null); }}
            className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300
              ${currentView === 'myClasses' || currentView === 'classDetails' ? 'bg-blue-600 text-white transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
          >
            My Registered Classes
          </button>
          <button
            onClick={() => { setCurrentView('myGrades'); setSelectedClassDetails(null); }}
            className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300
              ${currentView === 'myGrades' ? 'bg-blue-600 text-white transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
          >
            My Grades
          </button>
        </nav>
      </header>

      {/* Transient Notification */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-md shadow-lg z-50 transition-all duration-300 ease-out">
          {notificationMessage}
        </div>
      )}

      <main className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        {currentView === 'dashboard' && (
          <Dashboard
            registeredClasses={registeredClasses}
            grades={grades}
          />
        )}
        {currentView === 'classesList' && (
          <CourseCatalog
            availableClasses={availableClasses}
            registeredClasses={registeredClasses}
            onRegister={handleRegister}
          />
        )}
        {currentView === 'myClasses' && (
          <MyClasses
            registeredClasses={registeredClasses}
            onViewDetails={handleViewClassDetails}
            onUnregister={handleUnregister}
          />
        )}
        {currentView === 'myGrades' && (
          <MyGrades
            registeredClasses={registeredClasses}
            grades={grades}
          />
        )}
        {currentView === 'classDetails' && selectedClassDetails && (
          <ClassDetails
            classDetails={selectedClassDetails}
            onBack={() => setCurrentView('myClasses')}
          />
        )}
      </main>

      {/* Confirmation Modal Component */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <p className="text-lg font-semibold text-gray-800 mb-4">{confirmMessage}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmAction}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
              >
                OK
              </button>
              <button
                onClick={handleCancelAction}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// New Dashboard Component








// Component for displaying class details
const ClassDetails = ({ classDetails, onBack }: { 
  classDetails: ClassData; 
  onBack: () => void; 
}) => {
  if (!classDetails) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{classDetails.courseName} Details</h2>
      <div className="space-y-3 text-gray-700">
        <p><span className="font-semibold">Course ID:</span> {classDetails.courseCode}</p>
        <p><span className="font-semibold">Description:</span> {classDetails.description}</p>
        <p><span className="font-semibold">Professor:</span> {classDetails.instructor}</p>
        <p><span className="font-semibold">Credits:</span> {classDetails.credits}</p>
        <p><span className="font-semibold">Department:</span> {classDetails.majorDepartment?.departmentCode}</p>
        <p><span className="font-semibold">Semester:</span> {classDetails.year} {classDetails.semester} ({classDetails.availableForSemester})</p>
      </div>
      <button
        onClick={onBack}
        className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-md"
      >
        Back to My Registered Classes
      </button>
    </div>
  );
};

export default App;
