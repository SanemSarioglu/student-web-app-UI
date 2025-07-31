import React, { useState, useEffect } from 'react';
import { Department } from '../types/entities';

interface ClassDefinitionProps {
  onClassCreated: () => void;
}

interface NewClassData {
  courseCode: string;
  courseName: string;
  credits: number;
  majorCode: string;
  availableForSemester: string;
  prerequisites: string;
  isActive: boolean;
}

const ClassDefinition: React.FC<ClassDefinitionProps> = ({ onClassCreated }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<NewClassData>({
    courseCode: '',
    courseName: '',
    credits: 3.0,
    majorCode: '',
    availableForSemester: 'BA1',
    prerequisites: '',
    isActive: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments
        const deptResponse = await fetch('http://localhost:8080/api/departments');
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          setDepartments(deptData);
        } else {
          throw new Error('Failed to fetch departments');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({ type: 'error', text: 'Failed to load departments' });
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'credits' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Create course only
      const courseResponse = await fetch('http://localhost:8080/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseCode: formData.courseCode,
          courseName: formData.courseName,
          credits: formData.credits,
          prerequisites: formData.prerequisites,
          isActive: formData.isActive,
          majorDepartment: { departmentCode: formData.majorCode },
          availableForSemester: formData.availableForSemester
        })
      });

      if (!courseResponse.ok) {
        const errorData = await courseResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create course');
      }

      setMessage({ type: 'success', text: 'Course created successfully!' });
      
      // Reset form
      setFormData({
        courseCode: '',
        courseName: '',
        credits: 3.0,
        majorCode: '',
        availableForSemester: 'BA1',
        prerequisites: '',
        isActive: true
      });

      // Notify parent component
      onClassCreated();
    } catch (error) {
      console.error('Error creating course:', error);
      setMessage({ type: 'error', text: `Failed to create course: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Define New Class</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Course Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Code *
                </label>
                <input
                  type="text"
                  id="courseCode"
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., CS101"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Introduction to Computer Science"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="majorCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  id="majorCode"
                  name="majorCode"
                  value={formData.majorCode}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.departmentCode} value={dept.departmentCode}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-2">
                  Credits *
                </label>
                <input
                  type="number"
                  id="credits"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  required
                  step="0.5"
                  min="0"
                  max="10"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="availableForSemester" className="block text-sm font-medium text-gray-700 mb-2">
                  Available For Semester *
                </label>
                <select
                  id="availableForSemester"
                  name="availableForSemester"
                  value={formData.availableForSemester}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="BA1">BA1</option>
                  <option value="BA2">BA2</option>
                  <option value="BA3">BA3</option>
                  <option value="BA4">BA4</option>
                  <option value="BA5">BA5</option>
                  <option value="BA6">BA6</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700 mb-2">
                Prerequisites
              </label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g., MATH100 or equivalent"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active Course
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassDefinition; 