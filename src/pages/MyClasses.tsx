import React from 'react';
import { ClassData } from '../types/ui';

interface MyClassesProps {
  registeredClasses: ClassData[];
  onViewDetails: (classObj: ClassData) => void;
  onUnregister: (classId: string) => void;
}

const MyClasses: React.FC<MyClassesProps> = ({ registeredClasses, onViewDetails, onUnregister }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">My Registered Classes</h2>
      
      {/* Note about current semester */}
      <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
        <p className="text-purple-800 text-sm">
          <strong>Note:</strong> Only your current 2025 Fall semester classes are shown here. Completed classes from previous semesters are not displayed.
        </p>
      </div>
      
      {registeredClasses.length > 0 ? (
        <ul className="space-y-4">
          {registeredClasses.map((cls, index) => (
            <li
              key={`${cls.courseCode}-${cls.semester}-${cls.year}-${index}`}
              className="bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-200 flex flex-col sm:flex-row items-center justify-between"
            >
              <div
                onClick={() => onViewDetails(cls)} // Make the class name clickable for details
                className="flex-grow cursor-pointer hover:underline text-lg font-medium text-purple-800 mb-2 sm:mb-0"
              >
                {cls.courseName}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent view details from triggering
                  onUnregister(cls.courseCode);
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

export default MyClasses; 