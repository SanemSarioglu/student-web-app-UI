import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Type definitions
interface ClassData {
  id: string;
  name: string;
  professor: string;
  credits: number;
  department: string;
  semesterLevel: string;
  year: number;
  semester: string;
  description: string;
  assignments?: any[];
}

interface GradeData {
  midterm: number | string;
  project: number | string;
  final: number | string;
  quizzes: number | string;
}

interface Grades {
  [key: string]: GradeData;
}

// Helper function to convert semester level string (e.g., 'BA1') to an integer for comparison
const getSemesterLevelValue = (level: string): number => {
  if (!level) return 0;
  const match = level.match(/BA(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Helper to calculate overall grade from sub-grades (midterm, project, final, quizzes)
const calculateOverallCourseGrade = (gradesObject: GradeData | undefined): number | string => {
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
const getGradeColorClass = (grade: number | string): string => {
  if (typeof grade !== 'number') return 'bg-gray-100 text-gray-600'; // For 'N/A' or invalid grades

  if (grade >= 5.5) return 'bg-green-200 text-green-800'; // 6
  if (grade >= 4.5) return 'bg-lime-100 text-lime-700';   // 5
  if (grade >= 3.5) return 'bg-blue-100 text-blue-700';   // 4
  if (grade >= 2.5) return 'bg-yellow-100 text-yellow-700'; // 3
  if (grade >= 1.5) return 'bg-orange-100 text-orange-700'; // 2
  if (grade >= 1) return 'bg-red-100 text-red-700';     // 1
  return 'bg-gray-100 text-gray-600'; // Default fallback
};

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

  // Mock data for initial setup - REVISED for logical student progression
  useEffect(() => {
    // Added 'semester' property to all class objects
    const allCourses: ClassData[] = [
      // BA1 - 2023
      { id: 'hist101', name: 'Intro to History', professor: 'Prof. Miller', credits: 3, department: 'HIST', semesterLevel: 'BA1', year: 2023, semester: 'Fall', description: 'A survey of major historical events.' },
      { id: 'lit101', name: 'World Literature', professor: 'Dr. Kim', credits: 3, department: 'LIT', semesterLevel: 'BA1', year: 2023, semester: 'Fall', description: 'Exploring literary works from around the globe.' },
      // BA1 - 2024
      { id: 'math101', name: 'Calculus I', description: 'Introduction to differential and integral calculus.', professor: 'Dr. Emily White', credits: 3, department: 'MATH', semesterLevel: 'BA1', year: 2024, semester: 'Spring' },
      { id: 'phy101', name: 'Physics I', description: 'Classical mechanics and thermodynamics.', professor: 'Dr. Robert Green', credits: 3, department: 'PHYS', semesterLevel: 'BA1', year: 2024, semester: 'Spring' },
      // BA2 - 2024
      { id: 'math201', name: 'Linear Algebra', professor: 'Dr. Sarah Davis', credits: 3, department: 'MATH', semesterLevel: 'BA2', year: 2024, semester: 'Fall', description: 'Study of vectors, matrices, and linear transformations.' },
      { id: 'bio201', name: 'General Biology', professor: 'Prof. Jane Smith', credits: 3, department: 'BIO', semesterLevel: 'BA2', year: 2024, semester: 'Fall', description: 'Fundamental concepts of biology.' },
      // BA2 - 2025 (Previous Semester)
      { id: 'cs202', name: 'Operating Systems', professor: 'Dr. Alan Grant', credits: 4, department: 'CS', semesterLevel: 'BA2', year: 2025, semester: 'Spring', description: 'Core concepts of modern operating systems.' },
      { id: 'phys201', name: 'Electromagnetism', description: 'Principles of electricity and magnetism.', professor: 'Dr. Chris Wilson', credits: 3, department: 'PHYS', semesterLevel: 'BA2', year: 2025, semester: 'Spring' },
      { id: 'elec301', name: 'Circuit Analysis', description: 'Analysis of electrical circuits.', professor: 'Dr. John Doe', credits: 4, department: 'ELEC', semesterLevel: 'BA2', year: 2025, semester: 'Spring' },
      { id: 'chem201', name: 'Organic Chemistry', description: 'Structure, properties, and reactions of organic compounds.', professor: 'Dr. Walter White', credits: 3, department: 'CHEM', semesterLevel: 'BA2', year: 2025, semester: 'Spring' },
      // BA3 - 2025 (Current Semester - Ongoing)
      { id: 'cs301', name: 'Algorithms', professor: 'Prof. Mark Johnson', credits: 4, department: 'CS', semesterLevel: 'BA3', year: 2025, semester: 'Fall', description: 'Design and analysis of algorithms.' },
      { id: 'bio301', name: 'Genetics', professor: 'Prof. Laura Martinez', credits: 4, department: 'BIO', semesterLevel: 'BA3', year: 2025, semester: 'Fall', description: 'Principles of heredity and variation.' },
      // Other available classes
      { id: 'cs401', name: 'Machine Learning', description: 'Introduction to machine learning algorithms and applications.', professor: 'Dr. Elena Rodriguez', credits: 4, department: 'CS', semesterLevel: 'BA4', year: 2026, semester: 'Spring' },
    ];
    setAvailableClasses(allCourses);

    const studentRegisteredClasses: ClassData[] = [
        // Past semesters
        allCourses.find(c => c.id === 'hist101')!,
        allCourses.find(c => c.id === 'lit101')!,
        allCourses.find(c => c.id === 'math101')!,
        allCourses.find(c => c.id === 'phy101')!,
        allCourses.find(c => c.id === 'math201')!,
        allCourses.find(c => c.id === 'bio201')!,
        allCourses.find(c => c.id === 'cs202')!,
        allCourses.find(c => c.id === 'phys201')!,
        allCourses.find(c => c.id === 'elec301')!,
        allCourses.find(c => c.id === 'chem201')!,
        // Current semester (ongoing)
        allCourses.find(c => c.id === 'cs301')!,
        allCourses.find(c => c.id === 'bio301')!,
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
    if (registeredClasses.some(cls => cls.id === classToRegister.id)) {
      showTransientNotification(`You are already registered for ${classToRegister.name}.`);
      return;
    }
    showConfirmation(`Are you sure you want to register for ${classToRegister.name}?`, () => {
      setRegisteredClasses(prev => [...prev, { ...classToRegister, assignments: [] }]); // Add assignments array
      setGrades(prev => ({
        ...prev,
        [classToRegister.id]: { midterm: 'N/A', project: 'N/A', final: 'N/A', quizzes: 'N/A' }
      }));
      showTransientNotification(`Successfully registered for ${classToRegister.name}!`);
    });
  };

  // Function to handle class unregistration
  const handleUnregister = (classId: string) => {
    const classToUnregister = registeredClasses.find(cls => cls.id === classId);
    if (!classToUnregister) return;

    showConfirmation(`Are you sure you want to unregister from ${classToUnregister.name}?`, () => {
      // Remove class from registeredClasses
      setRegisteredClasses(prev => prev.filter(cls => cls.id !== classId));
      // Remove grades for that class
      setGrades(prev => {
        const newGrades = { ...prev };
        delete newGrades[classId];
        return newGrades;
      });
      showTransientNotification(`Successfully unregistered from ${classToUnregister.name}.`);
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
          <ClassesList
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
const Dashboard = ({ registeredClasses, grades }: { registeredClasses: ClassData[]; grades: Grades }) => {
  // Get ongoing classes (those with no numerical grades yet)
  const ongoingClasses = registeredClasses.filter(cls => {
    const classGrades = grades[cls.id];
    return !classGrades || Object.values(classGrades).every(grade => typeof grade !== 'number' || (typeof grade === 'string' && grade === 'N/A'));
  });

  // Get grades for the previous semester (Spring 2025)
  const previousSemesterYear = 2025;
  const previousSemesterName = 'Spring';

  const previousSemesterGrades = registeredClasses
    .filter(cls => cls.year === previousSemesterYear && cls.semester === previousSemesterName)
    .map(cls => ({
        id: cls.id,
        name: cls.name,
        overallGrade: calculateOverallCourseGrade(grades[cls.id]),
    }))
    .filter(g => typeof g.overallGrade === 'number') // Only show courses with numerical grades
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name

  // Prepare data for the yearly average grade chart
  const getYearlyGradesData = () => {
    const gradesByYear: { [key: number]: { totalGrade: number; count: number } } = {};

    registeredClasses.forEach(cls => {
      const overallGrade = calculateOverallCourseGrade(grades[cls.id]);
      if (typeof overallGrade === 'number') { // Only include numerical overall grades
        const year = cls.year;
        if (!gradesByYear[year]) {
          gradesByYear[year] = { totalGrade: 0, count: 0 };
        }
        gradesByYear[year].totalGrade += overallGrade;
        gradesByYear[year].count += 1;
      }
    });

    // Convert to an array for Recharts and sort by year
    const yearlyData = Object.keys(gradesByYear).map(year => ({
      year: parseInt(year),
      averageGrade: parseFloat((gradesByYear[parseInt(year)].totalGrade / gradesByYear[parseInt(year)].count).toFixed(2))
    })).sort((a, b) => a.year - b.year);

    return yearlyData;
  };

  const chartData = getYearlyGradesData();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Your Personalized Dashboard</h2>

      {/* Ongoing Classes */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Ongoing Classes (Fall 2025)</h3>
        {ongoingClasses.length > 0 ? (
          <ul className="space-y-3">
            {ongoingClasses.map(cls => (
              <li key={cls.id} className="flex justify-between items-center text-gray-700">
                <span>{cls.name}</span>
                <span className="text-sm text-gray-500">Grades Pending</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No ongoing classes.</p>
        )}
      </div>

      <hr className="my-8 border-gray-300" /> {/* Separator */}

      {/* Previous Semester Grades */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Grades from Previous Semester (Spring 2025)</h3>
        {previousSemesterGrades.length > 0 ? (
          <ul className="space-y-3">
            {previousSemesterGrades.map(grade => (
              <li key={grade.id} className="flex justify-between items-center text-gray-700">
                <span>{grade.name}</span>
                <span className={`py-1 px-3 rounded-full text-xs font-semibold ${getGradeColorClass(grade.overallGrade)}`}>
                  {grade.overallGrade}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No grades available for the previous semester.</p>
        )}
      </div>

      <hr className="my-8 border-gray-300" /> {/* Separator */}

      {/* Yearly Grade Fluctuation Graph */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Average Grade Fluctuation Over Years</h3>
      {chartData.length > 0 ? (
        <div className="p-2 border border-gray-200 rounded-lg shadow-sm max-w-md mx-auto">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[1, 6]} ticks={[1, 2, 3, 4, 5, 6]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageGrade" name="Average Grade" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No sufficient data to display yearly grade fluctuation.</p>
      )}
    </div>
  );
};

// Component for listing all classes
const ClassesList = ({ availableClasses, registeredClasses, onRegister }: { 
  availableClasses: ClassData[]; 
  registeredClasses: ClassData[]; 
  onRegister: (classToRegister: ClassData) => void; 
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedSemesterLevel, setSelectedSemesterLevel] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [courseCodeFilter, setCourseCodeFilter] = useState<string>('');

  // Filter classes based on all selected filters
  const filteredClasses = availableClasses.filter(cls =>
    (selectedDepartment === 'ALL' || cls.department === selectedDepartment) &&
    (selectedSemesterLevel === 'ALL' || cls.semesterLevel === selectedSemesterLevel) &&
    (selectedYear === 'ALL' || cls.year === parseInt(selectedYear)) &&
    cls.id.toLowerCase().includes(courseCodeFilter.toLowerCase())
  );

  // Extract unique values for filters
  const uniqueSemesterLevels = ['ALL', ...new Set(availableClasses.map(cls => cls.semesterLevel))].sort((a, b) => getSemesterLevelValue(a) - getSemesterLevelValue(b));
  const uniqueYears = ['ALL', ...new Set(availableClasses.map(cls => cls.year))].sort();
  const uniqueDepartments = ['ALL', ...new Set(availableClasses.map(cls => cls.department))].sort();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">All Available Courses</h2>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Department Filter */}
        <div className="flex flex-col">
          <label htmlFor="department-filter" className="text-lg font-medium text-gray-700 mb-1">Department:</label>
          <select
            id="department-filter"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {uniqueDepartments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
        </div>

        {/* Year Filter */}
        <div className="flex flex-col">
          <label htmlFor="year-filter" className="text-lg font-medium text-gray-700 mb-1">Year:</label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>

        {/* Semester Level Filter */}
        <div className="flex flex-col">
          <label htmlFor="semester-filter" className="text-lg font-medium text-gray-700 mb-1">Semester Level:</label>
          <select
            id="semester-filter"
            value={selectedSemesterLevel}
            onChange={(e) => setSelectedSemesterLevel(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {uniqueSemesterLevels.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
        </div>

        {/* Course Code Filter */}
        <div className="flex flex-col">
          <label htmlFor="course-code-filter-all" className="text-lg font-medium text-gray-700 mb-1">Course Code:</label>
          <input
            type="text"
            id="course-code-filter-all"
            value={courseCodeFilter}
            onChange={(e) => setCourseCodeFilter(e.target.value)}
            placeholder="e.g., MATH101"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {filteredClasses.length > 0 ? (
        <ul className="space-y-4">
          {filteredClasses.map(cls => (
            <li key={cls.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-800">{cls.name} ({cls.id})</h3>
                <p className="text-gray-600 text-sm">Prof: {cls.professor} | Credits: {cls.credits} | Dept: {cls.department} | Level: {cls.semesterLevel} | Year: {cls.year} {cls.semester}</p>
                <p className="text-gray-700 text-sm mt-1">{cls.description}</p>
              </div>
              <button
                onClick={() => onRegister(cls)}
                disabled={registeredClasses.some(rCls => rCls.id === cls.id)}
                className={`mt-4 sm:mt-0 ml-0 sm:ml-4 py-2 px-4 rounded-md text-white font-semibold transition-colors duration-300
                  ${registeredClasses.some(rCls => rCls.id === cls.id)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 shadow-md'}`}
              >
                {registeredClasses.some(rCls => rCls.id === cls.id) ? 'Registered' : 'Register'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No courses available with the selected filters.</p>
      )}
    </div>
  );
};

// Component for viewing registered classes
const MyClasses = ({ registeredClasses, onViewDetails, onUnregister }: { 
  registeredClasses: ClassData[]; 
  onViewDetails: (classObj: ClassData) => void; 
  onUnregister: (classId: string) => void; 
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">My Registered Classes</h2>
      {registeredClasses.length > 0 ? (
        <ul className="space-y-4">
          {registeredClasses.map(cls => (
            <li
              key={cls.id}
              className="bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-200 flex flex-col sm:flex-row items-center justify-between"
            >
              <div
                onClick={() => onViewDetails(cls)} // Make the class name clickable for details
                className="flex-grow cursor-pointer hover:underline text-lg font-medium text-purple-800 mb-2 sm:mb-0"
              >
                {cls.name}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent view details from triggering
                  onUnregister(cls.id);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 shadow-md text-sm"
              >
                Unregister
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">You are not registered for any classes yet.</p>
      )}
    </div>
  );
};

// Component for viewing grades
const MyGrades = ({ registeredClasses, grades }: { 
  registeredClasses: ClassData[]; 
  grades: Grades; 
}) => {
  // Filter classes with numerical grades to be included in the view
  const classesWithGrades = registeredClasses.filter(cls => {
    const overallGrade = calculateOverallCourseGrade(grades[cls.id]);
    return typeof overallGrade === 'number';
  });

  // Calculate overall average grade across all classes (that have grades)
  const totalOverallPoints = classesWithGrades.reduce((sum, cls) => {
    const overallGrade = calculateOverallCourseGrade(grades[cls.id]);
    return sum + (overallGrade as number);
  }, 0);

  const averageOverallGrade = classesWithGrades.length > 0 ? (totalOverallPoints / classesWithGrades.length).toFixed(2) : 'N/A';

  // Group grades by a combined year-semester key
  const groupedGradesBySemester: { [key: string]: { year: number; semester: string; classes: (ClassData & { overallGrade: number })[] } } = {};
  classesWithGrades.forEach(cls => {
    const overallGrade = calculateOverallCourseGrade(grades[cls.id]);
    if (typeof overallGrade === 'number') {
      const semesterKey = `${cls.year}-${cls.semester}`; 

      if (!groupedGradesBySemester[semesterKey]) {
        groupedGradesBySemester[semesterKey] = {
          year: cls.year,
          semester: cls.semester,
          classes: [],
        };
      }
      groupedGradesBySemester[semesterKey].classes.push({
        ...cls,
        overallGrade: overallGrade,
      });
    }
  });

  // Sort semester keys chronologically (most recent first)
  const sortedSemesterKeys = Object.keys(groupedGradesBySemester).sort((keyA: string, keyB: string) => {
    const [yearA, semesterA] = keyA.split('-');
    const [yearB, semesterB] = keyB.split('-');

    if (parseInt(yearA) !== parseInt(yearB)) {
      return parseInt(yearB) - parseInt(yearA);
    }
    // 'Fall' comes after 'Spring'
    return semesterB.localeCompare(semesterA);
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">My Grades</h2>

      {registeredClasses.length > 0 ? (
        <>
          {/* Overall Average Grade */}
          <div className="mb-4 text-center">
            <p className="text-xl font-bold text-gray-800">Overall Average Grade: <span className={`py-1 px-3 rounded-full text-lg font-semibold ${getGradeColorClass(parseFloat(averageOverallGrade))}`}>{averageOverallGrade}</span></p>
          </div>

          {/* Display grades grouped by year and semester */}
          {sortedSemesterKeys.length > 0 ? (
            <div className="space-y-6">
              {sortedSemesterKeys.map(semesterKey => {
                const semesterData = groupedGradesBySemester[semesterKey];
                return (
                  <div key={semesterKey} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{semesterData.year} {semesterData.semester} Semester</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                        <thead>
                          <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-2 px-4 border-b border-gray-200">Class Name</th>
                            <th className="py-2 px-4 border-b border-gray-200">Overall Grade (1-6)</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 text-base font-light">
                          {semesterData.classes
                            .sort((a, b) => a.name.localeCompare(b.name)) // Sort classes alphabetically
                            .map(cls => (
                              <tr key={cls.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-2 px-4 whitespace-nowrap">{cls.name} ({cls.id})</td>
                                <td className="py-2 px-4">
                                  <span className={`py-1 px-3 rounded-full text-xs font-semibold ${getGradeColorClass(cls.overallGrade)}`}>
                                    {cls.overallGrade}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-8">No grades available for completed courses.</p>
          )}
        </>
      ) : (
        <p className="text-gray-600 text-center">You haven't registered for any classes yet, so there are no grades to display.</p>
      )}
    </div>
  );
};

// Component for displaying class details
const ClassDetails = ({ classDetails, onBack }: { 
  classDetails: ClassData; 
  onBack: () => void; 
}) => {
  if (!classDetails) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{classDetails.name} Details</h2>
      <div className="space-y-3 text-gray-700">
        <p><span className="font-semibold">Course ID:</span> {classDetails.id}</p>
        <p><span className="font-semibold">Description:</span> {classDetails.description}</p>
        <p><span className="font-semibold">Professor:</span> {classDetails.professor}</p>
        <p><span className="font-semibold">Credits:</span> {classDetails.credits}</p>
        <p><span className="font-semibold">Department:</span> {classDetails.department}</p>
        <p><span className="font-semibold">Semester:</span> {classDetails.year} {classDetails.semester} ({classDetails.semesterLevel})</p>
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
