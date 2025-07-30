import React, { useState } from 'react';
import { ClassData } from '../types/ui';
import { getSemesterLevelValue } from '../utils/gradeUtils';

interface CourseCatalogProps {
  availableClasses: ClassData[];
  registeredClasses: ClassData[];
  onRegister: (classToRegister: ClassData) => void;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ availableClasses, registeredClasses, onRegister }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedSemesterLevel, setSelectedSemesterLevel] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedSemester, setSelectedSemester] = useState<string>('Fall');
  const [courseCodeFilter, setCourseCodeFilter] = useState<string>('');

  // Filter classes based on all selected filters
  const filteredClasses = availableClasses.filter(cls =>
    cls && // Check if cls exists
    (selectedDepartment === 'ALL' || (cls.majorDepartment?.departmentCode && cls.majorDepartment.departmentCode === selectedDepartment)) &&
    (selectedSemesterLevel === 'ALL' || (cls.availableForSemester && cls.availableForSemester === selectedSemesterLevel)) &&
    (selectedYear === 'ALL' || (cls.year && cls.year === parseInt(selectedYear))) &&
    (selectedSemester === 'ALL' || (cls.semester && cls.semester === selectedSemester)) &&
    (typeof cls.courseCode === 'string' && cls.courseCode.toLowerCase().includes(courseCodeFilter.toLowerCase()))
  );

  // Extract unique values for filters with null checks
  const uniqueSemesterLevels = ['ALL', ...new Set(availableClasses.filter(cls => cls && cls.availableForSemester).map(cls => cls.availableForSemester))].sort((a, b) => getSemesterLevelValue(a) - getSemesterLevelValue(b));
  const uniqueYears = ['ALL', ...new Set(availableClasses.filter(cls => cls && cls.year).map(cls => cls.year))].sort();
  const uniqueSemesters = ['ALL', ...new Set(availableClasses.filter(cls => cls && cls.semester).map(cls => cls.semester))].sort();
  const uniqueDepartments = ['ALL', ...new Set(availableClasses.filter(cls => cls && cls.majorDepartment?.departmentCode).map(cls => cls.majorDepartment.departmentCode))].sort();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">All Available Courses</h2>
      
      {/* Note about default filter */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> By default, only 2025 Fall semester classes are shown. Use the filters below to view other semesters or years.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

        {/* Semester Filter */}
        <div className="flex flex-col">
          <label htmlFor="semester-filter" className="text-lg font-medium text-gray-700 mb-1">Semester:</label>
          <select
            id="semester-filter"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {uniqueSemesters.map(semester => <option key={semester} value={semester}>{semester}</option>)}
          </select>
        </div>

        {/* Semester Level Filter */}
        <div className="flex flex-col">
          <label htmlFor="semester-level-filter" className="text-lg font-medium text-gray-700 mb-1">Semester Level:</label>
          <select
            id="semester-level-filter"
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
            placeholder="e.g., CS112"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {filteredClasses.length > 0 ? (
        <ul className="space-y-4">
          {filteredClasses.map((cls, index) => (
            <li key={`${cls?.courseCode || 'unknown'}-${cls?.semester || 'unknown'}-${cls?.year || 'unknown'}-${index}`} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-800">{cls?.courseName || 'Unknown Course'} ({cls?.courseCode || 'N/A'})</h3>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium text-blue-700">{cls?.year} {cls?.semester}</span> | 
                  Instructor: {cls?.instructor || 'N/A'} | 
                  Credits: {cls?.credits || 'N/A'} | 
                  Dept: {cls?.majorDepartment?.departmentCode || 'N/A'} | 
                  Level: {cls?.availableForSemester || 'N/A'}
                </p>
                <p className="text-gray-700 text-sm mt-1">Prerequisites: {cls?.prerequisites || 'None'} | Active: {cls?.active ? 'Yes' : 'No'}</p>
                {cls?.currentEnrollment !== undefined && cls?.capacity !== undefined && (
                  <p className="text-blue-600 text-sm mt-1">
                    Enrollment: {cls.currentEnrollment}/{cls.capacity} students
                    {cls.currentEnrollment >= cls.capacity && (
                      <span className="text-red-600 ml-2">(Full)</span>
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={() => onRegister(cls)}
                disabled={registeredClasses.some(rCls => rCls.courseCode === cls?.courseCode)}
                className={`mt-4 sm:mt-0 ml-0 sm:ml-4 py-2 px-4 rounded-md text-white font-semibold transition-colors duration-300
                  ${registeredClasses.some(rCls => rCls.courseCode === cls?.courseCode)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 shadow-md'}`}
              >
                {registeredClasses.some(rCls => rCls.courseCode === cls?.courseCode) ? 'Registered' : 'Register'}
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

export default CourseCatalog; 