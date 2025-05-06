'use client'
import Footer from '@/app/components/Footer';
import NavBarInst from '@/app/components/NavBarInst';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAssingendCourses, submitGrade } from '@/app/server/server-actions';

export default function InstructorPortal() {
  const router = useRouter();
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gradeInputs, setGradeInputs] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (typeof window === 'undefined' || !sessionStorage.getItem("sessionId")) {
          router.push("/");
          return;
        }

        const email = sessionStorage.getItem("sessionId")?.split("#")[1];
        if (!email) {
          router.push("/");
          return;
        }

        const courses = await getAssingendCourses(email);
        setAssignedCourses(courses);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleViewStudents = (course) => {
    setSelectedCourse(course);
    // Initialize grade inputs
    const inputs = {};
    course.students.forEach(student => {
      inputs[student.id] = student.grade === 'N/A' ? '' : student.grade;
    });
    setGradeInputs(inputs);
  };

  const handleGradeChange = (studentId, value) => {
    setGradeInputs(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleSubmitGrades = async () => {
    if (!selectedCourse) return;
    
    try {
      const updates = Object.entries(gradeInputs)
        .filter(([_, grade]) => grade.trim() !== '')
        .map(([studentId, grade]) => 
          submitGrade(studentId, selectedCourse.course_number, grade)
        );

      await Promise.all(updates);
      alert('Grades submitted successfully!');
      
      // Refresh the data
      const email = sessionStorage.getItem("sessionId")?.split("#")[1];
      const courses = await getAssingendCourses(email);
      setAssignedCourses(courses);
      const updatedCourse = courses.find(c => c.course_number === selectedCourse.course_number);
      if (updatedCourse) setSelectedCourse(updatedCourse);
    } catch (error) {
      alert('Error submitting grades: ' + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
                      <p className="text-sm text-gray-600">{course.students.length} students</p>
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
            {selectedCourse.students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedCourse.students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{student.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.grade}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={gradeInputs[student.id] || ''}
                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                            className="border rounded px-2 py-1 w-20"
                            placeholder="Enter grade"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={handleSubmitGrades}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Submit Grades
                </button>
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