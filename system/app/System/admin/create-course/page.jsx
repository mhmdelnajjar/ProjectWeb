'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCourse, getUsers, getCourses } from '@/app/server/server-actions';
import NavBarAdmin from '@/app/components/NavBarAdmin';
import Cookies from 'js-cookie';

export default function CreateCourse() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    course_number: '',
    course_name: '',
    category: '',
    course_instructor: '',
    capacity: '',
    prerequisite: '',
    image: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token');
      const userInfo = localStorage.getItem("user");

      if (!token || !userInfo) {
        router.push('/');
        return;
      }

      const userType = userInfo.split("#")[0];
      if (userType !== 'admin') {
        router.push('/');
        return;
      }

      try {
        setLoading(true);
        const [usersRes, coursesRes] = await Promise.all([
          getUsers(),
          getCourses()
        ]);
        setUsers(usersRes || []);
        setCourses(coursesRes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!newCourse.course_number || !newCourse.course_name || !newCourse.category || 
          !newCourse.course_instructor || !newCourse.capacity || !newCourse.image) {
        alert('Please fill in all required fields');
        return;
      }

      // Create course data object
      const courseData = {
        course_number: newCourse.course_number.trim(),
        course_name: newCourse.course_name.trim(),
        category: newCourse.category,
        course_instructor: newCourse.course_instructor,
        capacity: parseInt(newCourse.capacity),
        registeredStudents: 0,
        isOpen: true,
        prerequisite: newCourse.prerequisite || null,
        image: newCourse.image.trim()
      };

      // Create the course
      const createdCourse = await createCourse(courseData);
      
      if (createdCourse) {
        alert('Course created successfully!');
        router.push('/System/admin'); // Redirect back to admin page
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Filter instructors from users
  const instructors = users.filter(user => user.userType === 'instructor');

  return (
    <div className="min-h-screen flex flex-col">
      <NavBarAdmin />
      <main className="flex-1 p-8">
        <div className="create-course-form">
          <h1>Create New Course</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="course_number">Course Number:</label>
              <input
                type="text"
                id="course_number"
                value={newCourse.course_number}
                onChange={(e) => setNewCourse({...newCourse, course_number: e.target.value})}
                required
                placeholder="e.g., CS101"
              />
            </div>

            <div className="form-group">
              <label htmlFor="course_name">Course Name:</label>
              <input
                type="text"
                id="course_name"
                value={newCourse.course_name}
                onChange={(e) => setNewCourse({...newCourse, course_name: e.target.value})}
                required
                placeholder="e.g., Introduction to Programming"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={newCourse.category}
                onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="Programming">Programming</option>
                <option value="Database">Database</option>
                <option value="WEB">WEB</option>
                <option value="AI">AI</option>
                <option value="Cloud">Cloud</option>
                <option value="Security">Security</option>
                <option value="DevOps">DevOps</option>
                <option value="Mobile">Mobile</option>
                <option value="Networking">Networking</option>
                <option value="OOP">OOP</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="course_instructor">Instructor:</label>
              <select
                id="course_instructor"
                value={newCourse.course_instructor}
                onChange={(e) => setNewCourse({...newCourse, course_instructor: e.target.value})}
                required
              >
                <option value="">Select Instructor</option>
                {instructors.map(instructor => (
                  <option key={instructor.id} value={instructor.username}>
                    {instructor.name || instructor.username}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Capacity:</label>
              <input
                type="number"
                id="capacity"
                value={newCourse.capacity}
                onChange={(e) => setNewCourse({...newCourse, capacity: e.target.value})}
                required
                min="1"
                placeholder="e.g., 50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="prerequisite">Prerequisite:</label>
              <select
                id="prerequisite"
                value={newCourse.prerequisite}
                onChange={(e) => setNewCourse({...newCourse, prerequisite: e.target.value})}
              >
                <option value="">No Prerequisite</option>
                {courses.map(course => (
                  <option key={course.course_number} value={`${course.course_name}:${course.course_number}`}>
                    {course.course_name} ({course.course_number})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL:</label>
              <input
                type="url"
                id="image"
                value={newCourse.image}
                onChange={(e) => setNewCourse({...newCourse, image: e.target.value})}
                required
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => router.push('/System/admin')}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
              >
                Create Course
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 