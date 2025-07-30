import { useState, useEffect, useRef } from 'react';
import { apiService } from './services/api';
import { 
  ClassData, 
  Grades, 
  ViewType 
} from './types/ui';
import { 
  Student 
} from './types/entities';
import Dashboard from './pages/Dashboard';
import CourseCatalog from './pages/CourseCatalog';
import MyClasses from './pages/MyClasses';
import MyGrades from './pages/MyGrades';

// Main App component
const App = () => {
  // State to manage the current view
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  // State to store available classes
  const [availableClasses, setAvailableClasses] = useState<ClassData[]>([]);
  
  // State to store classes the student is registered for
  const [registeredClasses, setRegisteredClasses] = useState<ClassData[]>([]);
  
  // State to store grades for registered classes
  const [grades, setGrades] = useState<Grades>({});
  
  // State to store the details of the currently selected class
  const [selectedClassDetails, setSelectedClassDetails] = useState<ClassData | null>(null);

  // Student selection states
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // State for confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [confirmMessage, setConfirmMessage] = useState<string>('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  // State for transient notification
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to show a confirmation dialog
  const showConfirmation = (message: string, callback: () => void) => {
    setConfirmMessage(message);
    setOnConfirmCallback(() => callback);
    setIsConfirmModalOpen(true);
  };

  // Function to show a transient notification
  const showTransientNotification = (message: string) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotificationMessage(message);
    setShowNotification(true);
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage('');
    }, 3000);
  };

  // Handles confirmation action
  const handleConfirmAction = () => {
    setIsConfirmModalOpen(false);
    if (onConfirmCallback) {
      onConfirmCallback();
    }
  };

  // Handles cancellation of confirmation
  const handleCancelAction = () => {
    setIsConfirmModalOpen(false);
    setOnConfirmCallback(null);
  };

  // Fetch initial data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students
        const studentsResponse = await apiService.getStudents();
        if (studentsResponse.success && studentsResponse.data) {
          setStudents(studentsResponse.data);
          // Set first student as default if available
          if (studentsResponse.data.length > 0) {
            setSelectedStudent(studentsResponse.data[0]);
          }
          console.log('Successfully fetched students:', studentsResponse.data);
        } else {
          console.warn('Failed to fetch students:', studentsResponse.error);
        }

        // Fetch courses with their actual section information
        const coursesResponse = await apiService.getCoursesWithSections();
        if (coursesResponse.success && coursesResponse.data) {
          setAvailableClasses(coursesResponse.data);
          console.log('Successfully fetched courses with sections from database:', coursesResponse.data);
        } else {
          console.warn('Failed to fetch courses:', coursesResponse.error);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch enrollments when selected student changes
  useEffect(() => {
    const fetchStudentData = async () => {
      if (selectedStudent) {
        try {
          // Fetch enrollments for the selected student
          const enrollmentsResponse = await apiService.getStudentEnrollments(selectedStudent.id);
          if (enrollmentsResponse.success && enrollmentsResponse.data) {
            setRegisteredClasses(enrollmentsResponse.data);
            console.log('Successfully fetched enrollments for student:', enrollmentsResponse.data);
          } else {
            console.warn('Failed to fetch enrollments:', enrollmentsResponse.error);
          }

          // Fetch grades for the selected student
          const gradesResponse = await apiService.getStudentGrades(selectedStudent.id);
          if (gradesResponse.success && gradesResponse.data) {
            // The API service already returns GradeData objects, no transformation needed
            setGrades(gradesResponse.data);
            console.log('Successfully fetched grades for student:', gradesResponse.data);
          } else {
            console.warn('Failed to fetch grades:', gradesResponse.error);
          }
        } catch (error) {
          console.error('Error fetching student data:', error);
        }
      }
    };

    fetchStudentData();
  }, [selectedStudent]);

  // Handle student selection change
  const handleStudentChange = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    setSelectedStudent(student || null);
  };

  // Handle class registration
  const handleRegister = async (classToRegister: ClassData) => {
    if (!selectedStudent) {
      showTransientNotification('Please select a student first');
      return;
    }

    if (!classToRegister.sectionId) {
      showTransientNotification('Course section information not available');
      return;
    }

    showConfirmation(
      `Are you sure you want to register for ${classToRegister.courseName}?`,
      async () => {
        try {
          // Create enrollment in database using the sectionId from the course data
          const enrollmentResponse = await apiService.createEnrollment(selectedStudent.id, classToRegister.sectionId!);
          
          if (enrollmentResponse.success) {
            // Update local state
            setRegisteredClasses(prev => [...prev, classToRegister]);
            showTransientNotification(`Successfully registered for ${classToRegister.courseName}`);
          } else {
            showTransientNotification(`Failed to register: ${enrollmentResponse.error}`);
          }
        } catch (error) {
          console.error('Registration error:', error);
          showTransientNotification('Failed to register for course');
        }
      }
    );
  };

  // Handle class unregistration
  const handleUnregister = async (classId: string) => {
    const classToUnregister = registeredClasses.find(c => c.courseCode === classId);
    if (!classToUnregister || !selectedStudent) {
      showTransientNotification('No class found to unregister');
      return;
    }

    if (!classToUnregister.sectionId) {
      showTransientNotification('Course section information not available');
      return;
    }

    showConfirmation(
      `Are you sure you want to unregister from ${classToUnregister.courseName}?`,
      async () => {
        try {
          console.log('Looking for enrollment:', { studentId: selectedStudent.id, sectionId: classToUnregister.sectionId });
          
          // Find the enrollment to delete
          const enrollmentResponse = await apiService.getEnrollmentByStudentAndSection(
            selectedStudent.id, 
            classToUnregister.sectionId!
          );

          if (enrollmentResponse.success && enrollmentResponse.data) {
            console.log('Found enrollment:', enrollmentResponse.data);
            
            // Delete enrollment from database
            const deleteResponse = await apiService.deleteEnrollment(enrollmentResponse.data.enrollmentId);
            
            if (deleteResponse.success) {
              // Update local state
              setRegisteredClasses(prev => prev.filter(c => c.courseCode !== classId));
              showTransientNotification(`Successfully unregistered from ${classToUnregister.courseName}`);
            } else {
              console.error('Delete response error:', deleteResponse.error);
              showTransientNotification(`Failed to unregister: ${deleteResponse.error}`);
            }
          } else {
            console.error('Enrollment not found:', enrollmentResponse.error);
            showTransientNotification('Enrollment not found');
          }
        } catch (error) {
          console.error('Unregistration error:', error);
          showTransientNotification('Failed to unregister from course');
        }
      }
    );
  };

  // Handle viewing class details
  const handleViewClassDetails = (classObj: ClassData) => {
    setSelectedClassDetails(classObj);
    setCurrentView('classDetails');
  };

  // Handle going back from class details
  const handleBackFromClassDetails = () => {
    setSelectedClassDetails(null);
    setCurrentView('classesList');
  };

  // Get student display name
  const getStudentDisplayName = () => {
    if (!selectedStudent) return 'Please select a student';
    return `${selectedStudent.firstName} ${selectedStudent.lastName}`;
  };

  // Get student department
  const getStudentDepartment = () => {
    if (!selectedStudent?.department) return 'N/A';
    return selectedStudent.department.departmentCode;
  };

  // Get student semester
  const getStudentSemester = () => {
    if (!selectedStudent) return 'N/A';
    return selectedStudent.semester;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-inter">
      <header className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Student Portal</h1>

        {/* Student Selection Dropdown */}
        <div className="flex justify-center mb-4">
          <div className="w-64">
            <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Student:
            </label>
            <select
              id="student-select"
              value={selectedStudent?.id || ''}
              onChange={(e) => {
                const studentId = parseInt(e.target.value);
                handleStudentChange(studentId);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a student...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} - {student.departmentCode} ({student.semester})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Student information display */}
        <div className="text-center text-gray-700 mb-6">
          <p className="text-xl font-semibold">Welcome, {getStudentDisplayName()}!</p>
          <p className="text-md">Department: {getStudentDepartment()} | Semester: {getStudentSemester()}</p>
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
            onBack={handleBackFromClassDetails}
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
