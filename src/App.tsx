import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClassData, ViewType } from './types/ui';
import { Student } from './types/entities';
import { apiService } from './services/api';
import Dashboard from './pages/Dashboard';
import MyClasses from './pages/MyClasses';
import MyGrades from './pages/MyGrades';
import CourseCatalog from './pages/CourseCatalog';




// Main App component
const AppContent = () => {
  // Get initial view from URL
  const getInitialView = (): ViewType => {
    const path = window.location.pathname;
    if (path === '/') return 'dashboard';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/my-classes') return 'myClasses';
    if (path === '/my-grades') return 'myGrades';
    if (path === '/course-catalog') return 'classesList';
    
    return 'dashboard';
  };

  // State to manage the current view
  const [currentView, setCurrentView] = useState<ViewType>(getInitialView());
  
  // State to store available classes
  const [availableClasses, setAvailableClasses] = useState<ClassData[]>([]);
  
  // State to store classes the student is registered for
  const [registeredClasses, setRegisteredClasses] = useState<ClassData[]>([]);
  
  // State to store all enrollments for grades page (no deduplication)
  const [allStudentEnrollments, setAllStudentEnrollments] = useState<ClassData[]>([]);
  
  // State to store grades for registered classes
  const [grades, setGrades] = useState<any>({}); // Changed from Grades to any as per new import
  
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
          
          // Check URL for student ID first, then localStorage, then default to first student
          const urlParams = new URLSearchParams(window.location.search);
          const studentIdFromUrl = urlParams.get('student');
          const studentIdFromStorage = localStorage.getItem('selectedStudentId');
          
          let studentId: number | null = null;
          
          if (studentIdFromUrl) {
            studentId = parseInt(studentIdFromUrl);
          } else if (studentIdFromStorage) {
            studentId = parseInt(studentIdFromStorage);
          } else if (studentsResponse.data.length > 0) {
            studentId = studentsResponse.data[0].id;
          }
          
          if (studentId) {
            const student = studentsResponse.data.find(s => s.id === studentId);
            if (student) {
              setSelectedStudent(student);
              // Store in localStorage
              localStorage.setItem('selectedStudentId', studentId.toString());
            }
          }
          
          console.log('Successfully fetched students:', studentsResponse.data);
        } else {
          console.warn('Failed to fetch students:', studentsResponse.error);
        }

        // Fetch courses with sections
        const coursesResponse = await apiService.getCoursesWithSections();
        if (coursesResponse.success && coursesResponse.data) {
          setAvailableClasses(coursesResponse.data);
          console.log('Successfully fetched courses with sections:', coursesResponse.data);
        } else {
          console.warn('Failed to fetch courses with sections:', coursesResponse.error);
        }

        // Fetch all enrollments for grades
        const enrollmentsResponse = await apiService.getEnrollments();
        if (enrollmentsResponse.success && enrollmentsResponse.data) {
          // Use the existing method that returns ClassData[]
          const allEnrollmentsResponse = await apiService.getAllStudentEnrollments(1); // Use student ID 1 as default
          if (allEnrollmentsResponse.success && allEnrollmentsResponse.data) {
            setAllStudentEnrollments(allEnrollmentsResponse.data);
            console.log('Successfully fetched all enrollments:', allEnrollmentsResponse.data);
          }
        } else {
          console.warn('Failed to fetch all enrollments:', enrollmentsResponse.error);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchData();
  }, []);

  // Check URL on component mount to set current view
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') {
      setCurrentView('dashboard');
    } else if (path === '/dashboard') {
      setCurrentView('dashboard');
    } else if (path === '/my-classes') {
      setCurrentView('myClasses');
    } else if (path === '/my-grades') {
      setCurrentView('myGrades');
    } else if (path === '/course-catalog') {
      setCurrentView('classesList');
    }
  }, []);

  // Function to fetch student-specific data
  const fetchStudentData = async () => {
    if (!selectedStudent) return;

    try {
      // Fetch registered classes for the selected student
      const registeredResponse = await apiService.getStudentEnrollments(selectedStudent.id);
      if (registeredResponse.success && registeredResponse.data) {
        setRegisteredClasses(registeredResponse.data);
        console.log('Successfully fetched registered classes:', registeredResponse.data);
      } else {
        console.warn('Failed to fetch registered classes:', registeredResponse.error);
      }

      // Fetch grades for the selected student
      const gradesResponse = await apiService.getStudentGrades(selectedStudent.id);
      if (gradesResponse.success && gradesResponse.data) {
        setGrades(gradesResponse.data);
        console.log('Successfully fetched grades:', gradesResponse.data);
      } else {
        console.warn('Failed to fetch grades:', gradesResponse.error);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  // Fetch student data when selected student changes
  useEffect(() => {
    fetchStudentData();
  }, [selectedStudent]);

  const handleStudentChange = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    setSelectedStudent(student || null);
    
    // Store in localStorage
    localStorage.setItem('selectedStudentId', studentId.toString());
    
    // Update URL with student parameter
    const currentPath = window.location.pathname;
    const newUrl = `${currentPath}?student=${studentId}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleNavigation = (view: ViewType) => {
    setCurrentView(view);
    const currentStudentId = selectedStudent?.id || localStorage.getItem('selectedStudentId');
    
    let newPath = '';
    switch (view) {
      case 'dashboard':
        newPath = '/dashboard';
        break;
      case 'myClasses':
        newPath = '/my-classes';
        break;
      case 'myGrades':
        newPath = '/my-grades';
        break;
      case 'classesList':
        newPath = '/course-catalog';
        break;

      default:
        newPath = '/';
    }
    
    // Add student ID to URL if available
    if (currentStudentId) {
      newPath += `?student=${currentStudentId}`;
    }
    
    // Update URL
    window.history.pushState({}, '', newPath);
  };

  const handleRegister = async (classToRegister: ClassData) => {
    if (!selectedStudent) {
      showTransientNotification('Please select a student first.');
      return;
    }

    if (!classToRegister.sectionId) {
      showTransientNotification('Section information not available for this class.');
      return;
    }

    showConfirmation(
      `Are you sure you want to register for ${classToRegister.courseName}?`,
      async () => {
        try {
          const response = await apiService.createEnrollment(selectedStudent.id!, classToRegister.sectionId!);
          if (response.success) {
            showTransientNotification('Successfully registered for the class!');
            // Refresh student data
            fetchStudentData();
          } else {
            showTransientNotification(`Registration failed: ${response.error}`);
          }
        } catch (error) {
          console.error('Error registering for class:', error);
          showTransientNotification('An error occurred during registration.');
        }
      }
    );
  };

  const handleUnregister = async (classId: string) => {
    if (!selectedStudent) {
      showTransientNotification('Please select a student first.');
      return;
    }

    const classToUnregister = registeredClasses.find(c => c.sectionId === parseInt(classId));
    if (!classToUnregister) {
      showTransientNotification('Class not found.');
      return;
    }

    showConfirmation(
      `Are you sure you want to unregister from ${classToUnregister.courseName}?`,
      async () => {
        try {
          // First find the enrollment
          const enrollmentResponse = await apiService.getEnrollmentByStudentAndSection(
            selectedStudent.id, 
            classToUnregister.sectionId!
          );
          
          if (enrollmentResponse.success && enrollmentResponse.data) {
            // Delete the enrollment
            const deleteResponse = await apiService.deleteEnrollment(enrollmentResponse.data.enrollmentId);
            if (deleteResponse.success) {
              showTransientNotification('Successfully unregistered from the class!');
              // Refresh student data
              fetchStudentData();
            } else {
              showTransientNotification(`Unregistration failed: ${deleteResponse.error}`);
            }
          } else {
            showTransientNotification('Enrollment not found.');
          }
        } catch (error) {
          console.error('Error unregistering from class:', error);
          showTransientNotification('An error occurred during unregistration.');
        }
      }
    );
  };

  const handleViewClassDetails = (classObj: ClassData) => {
    setSelectedClassDetails(classObj);
  };

  const handleBackFromClassDetails = () => {
    setSelectedClassDetails(null);
  };

  const getStudentDisplayName = () => {
    return selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : 'No student selected';
  };

  const getStudentDepartment = () => {
    return selectedStudent?.department?.departmentName || 'Unknown Department';
  };

  const getStudentSemester = () => {
    return selectedStudent?.semester || 'Unknown Semester';
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
            onClick={() => handleNavigation('dashboard')}
            className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300
              ${currentView === 'dashboard' ? 'bg-blue-600 text-white transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavigation('classesList')}
            className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300
              ${currentView === 'classesList' ? 'bg-blue-600 text-white transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
          >
            All Classes
          </button>
          <button
            onClick={() => handleNavigation('myClasses')}
            className={`px-6 py-3 rounded-lg shadow-md transition-all duration-300
              ${currentView === 'myClasses' || currentView === 'classDetails' ? 'bg-blue-600 text-white transform scale-105' : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
          >
            My Registered Classes
          </button>
          <button
            onClick={() => handleNavigation('myGrades')}
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
        {selectedClassDetails ? (
          <ClassDetails
            classDetails={selectedClassDetails}
            onBack={handleBackFromClassDetails}
          />
        ) : (
          <>
            {currentView === 'dashboard' && (
              <Dashboard
                registeredClasses={allStudentEnrollments}
                grades={grades}
              />
            )}
            {currentView === 'myClasses' && (
              <MyClasses
                registeredClasses={registeredClasses}
                onUnregister={handleUnregister}
                onViewDetails={handleViewClassDetails}
              />
            )}
            {currentView === 'myGrades' && (
              <MyGrades
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

          </>
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

// Class Details component
const ClassDetails = ({ classDetails, onBack }: { 
  classDetails: ClassData; 
  onBack: () => void; 
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{classDetails.courseName}</h2>
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Back
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Course Information</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-600">Course Code:</span>
              <span className="ml-2 text-gray-800">{classDetails.courseCode}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Credits:</span>
              <span className="ml-2 text-gray-800">{classDetails.credits}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Department:</span>
              <span className="ml-2 text-gray-800">{classDetails.majorDepartment?.departmentName || 'Unknown'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Available For:</span>
              <span className="ml-2 text-gray-800">{classDetails.availableForSemester}</span>
            </div>
            {classDetails.prerequisites && (
              <div>
                <span className="font-medium text-gray-600">Prerequisites:</span>
                <span className="ml-2 text-gray-800">{classDetails.prerequisites}</span>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Section Information</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-600">Section ID:</span>
              <span className="ml-2 text-gray-800">{classDetails.sectionId}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Instructor:</span>
              <span className="ml-2 text-gray-800">{classDetails.instructor}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Semester:</span>
              <span className="ml-2 text-gray-800">{classDetails.semester}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Year:</span>
              <span className="ml-2 text-gray-800">{classDetails.year}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Capacity:</span>
              <span className="ml-2 text-gray-800">{classDetails.capacity}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Current Enrollment:</span>
              <span className="ml-2 text-gray-800">{classDetails.currentEnrollment}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Main App wrapper with Router
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
