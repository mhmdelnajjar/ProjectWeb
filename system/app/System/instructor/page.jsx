'use client'
import Footer from '@/app/components/Footer';
import NavBarInst from '@/app/components/NavBarInst';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAssingendCourses } from '@/app/server/server-actions';

export default function InstructorPortal() {
  const router = useRouter();
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check session
        if (typeof window === 'undefined' || !sessionStorage.getItem("sessionId")) {
          router.push("/");
          return;
        }

        const email = sessionStorage.getItem("sessionId")?.split("#")[1];
        if (!email) {
          router.push("/");
          return;
        }

        // Fetch courses and verify response
        const response = await getAssingendCourses(email);
        console.log('API Response:', response); // Debug log
        
        if (!response) {
          throw new Error("No response from server");
        }

        // Ensure response is an array
        const coursesArray = Array.isArray(response) ? response : [];
        setAssignedCourses(coursesArray);

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load courses");
        setAssignedCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleViewStudents = (course) => {
    setSelectedCourse(course);
    // Temporary mock data - replace with actual API call
    setStudents([
      { id: 1, name: 'Student One', grade: 'A' },
      { id: 2, name: 'Student Two', grade: 'B' }
    ]);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4">Loading courses...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen flex flex-col">
      <NavBarInst />
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Your Assigned Courses</h1>
        
        <div className="mb-8">
          {assignedCourses.length > 0 ? (
            <div className="grid gap-4">
              {assignedCourses.map((course) => (
                <div 
                  key={course.course_number} 
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{course.course_name}</h3>
                      <p className="text-sm text-gray-600">{course.course_number}</p>
                    </div>
                    <button 
                      onClick={() => handleViewStudents(course)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      View Students
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-gray-500">No courses assigned to you</p>
            </div>
          )}
        </div>

        {selectedCourse && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Students in {selectedCourse.course_name}
            </h2>
            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{student.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No students enrolled in this course</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}