import React from 'react';
import { ClassData, Grades } from '../types/ui';
import { calculateOverallCourseGrade, getGradeColorClass } from '../utils/gradeUtils';

interface MyGradesProps {
  registeredClasses: ClassData[];
  grades: Grades;
}

const MyGrades: React.FC<MyGradesProps> = ({ registeredClasses, grades }) => {
  // Filter classes with numerical grades to be included in the view
  const classesWithGrades = registeredClasses.filter(cls => {
    const overallGrade = calculateOverallCourseGrade(grades[cls.courseCode]);
    return typeof overallGrade === 'number';
  });

  // Calculate overall average grade across all classes (that have grades)
  const totalOverallPoints = classesWithGrades.reduce((sum, cls) => {
    const overallGrade = calculateOverallCourseGrade(grades[cls.courseCode]);
    return sum + (overallGrade as number);
  }, 0);

  const averageOverallGrade = classesWithGrades.length > 0 ? (totalOverallPoints / classesWithGrades.length).toFixed(2) : 'N/A';

  // Group grades by a combined year-semester key
  const groupedGradesBySemester: { [key: string]: { year: number; semester: string; classes: (ClassData & { overallGrade: number })[] } } = {};
  classesWithGrades.forEach(cls => {
    const overallGrade = calculateOverallCourseGrade(grades[cls.courseCode]);
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
                            .sort((a, b) => a.courseName.localeCompare(b.courseName)) // Sort classes alphabetically
                            .map((cls, index) => (
                              <tr key={`${cls.courseCode}-${cls.semester}-${cls.year}-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-2 px-4 whitespace-nowrap">{cls.courseName} ({cls.courseCode})</td>
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

export default MyGrades; 