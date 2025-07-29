import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ClassData, Grades } from '../types/ui';
import { calculateOverallCourseGrade, getGradeColorClass } from '../utils/gradeUtils';

interface DashboardProps {
  registeredClasses: ClassData[];
  grades: Grades;
}

const Dashboard: React.FC<DashboardProps> = ({ registeredClasses, grades }) => {
  // Get ongoing classes (those with no numerical grades yet)
  const ongoingClasses = registeredClasses.filter(cls => {
    const classGrades = grades[cls.courseCode];
    return !classGrades || Object.values(classGrades).every(grade => typeof grade !== 'number' || (typeof grade === 'string' && grade === 'N/A'));
  });

  // Get grades for the previous semester (Spring 2025)
  const previousSemesterYear = 2025;
  const previousSemesterName = 'Spring';

  const previousSemesterGrades = registeredClasses
    .filter(cls => cls.year === previousSemesterYear && cls.semester === previousSemesterName)
    .map(cls => ({
        id: cls.courseCode,
        name: cls.courseName,
        overallGrade: calculateOverallCourseGrade(grades[cls.courseCode]),
    }))
    .filter(g => typeof g.overallGrade === 'number') // Only show courses with numerical grades
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name

  // Prepare data for the yearly average grade chart
  const getYearlyGradesData = () => {
    const gradesByYear: { [key: number]: { totalGrade: number; count: number } } = {};

    registeredClasses.forEach(cls => {
      const overallGrade = calculateOverallCourseGrade(grades[cls.courseCode]);
      if (typeof overallGrade === 'number' && cls.year !== undefined) { // Only include numerical overall grades and ensure year exists
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
            {ongoingClasses.map((cls, index) => (
              <li key={`${cls.courseCode}-${cls.semester}-${cls.year}-${index}`} className="flex justify-between items-center text-gray-700">
                <span>{cls.courseName}</span>
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
      {chartData.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Yearly Grade Fluctuation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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

export default Dashboard; 