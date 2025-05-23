'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAllCourses, 
  getPendingRequests, 
  handleRequest, 
  toggleCourseApproval,
  deleteCourse,
  bulkUpdateCourses,
  bulkHandleRequests,
  getUsers,
  updateCourse
} from "@/app/server/server-actions"
import NavBarAdmin from '@/app/components/NavBarAdmin';
import Footer from '@/app/components/Footer';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bool, setBool] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check both localStorage and JWT token
      const token = Cookies.get('token');
      const userInfo = localStorage.getItem("user");

      if (!token || !userInfo) {
        router.push('/System/login');
        return;
      }

      // Verify user is admin
      const userType = userInfo.split("#")[0];
      if (userType !== 'admin') {
        router.push('/System/login');
        return;
      }

      setIsAuthenticated(true);
      try {
        setLoading(true);
        const [coursesRes, usersRes, requestsRes] = await Promise.all([
          getAllCourses(),
          getUsers(),
          getPendingRequests()
        ]);
        setCourses(coursesRes || []);
        setUsers(usersRes || []);
        setPendingRequests(requestsRes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleRequestAction = async (studentId, courseNumber, isApproved) => {
    try {
      await handleRequest(studentId, courseNumber, isApproved);
      // Refresh data
      const [coursesData, requestsData] = await Promise.all([
        getAllCourses(),
        getPendingRequests()
      ]);
      setCourses(coursesData);
      setPendingRequests(requestsData);
    } catch (error) {
      console.error('Error handling request:', error);
    }
  };

  const handleToggleApproval = async (courseNumber, isOpen) => {
    try {
      await toggleCourseApproval(courseNumber, isOpen);
      const updatedCourses = await getAllCourses();
      setCourses(updatedCourses);
    } catch (error) {
      console.error('Error toggling approval:', error);
    }
  };

  const handleDeleteCourse = async (courseNumber) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseNumber);
        const updatedCourses = await getAllCourses();
        setCourses(updatedCourses);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleBulkCourseUpdate = async (isOpen) => {
    if (confirm(`Are you sure you want to ${isOpen ? 'approve' : 'reject'} ALL courses?`)) {
      try {
        await bulkUpdateCourses(isOpen);
        const updatedCourses = await getAllCourses();
        setCourses(updatedCourses);
        alert(`All courses have been ${isOpen ? 'approved' : 'rejected'}`);
      } catch (error) {
        console.error('Error bulk updating courses:', error);
      }
    }
  };

  const handleBulkRequestUpdate = async (isApproved) => {
    if (confirm(`Are you sure you want to ${isApproved ? 'approve' : 'reject'} ALL requests?`)) {
      try {
        await bulkHandleRequests(isApproved);
        const [coursesData, requestsData] = await Promise.all([
          getAllCourses(),
          getPendingRequests()
        ]);
        setCourses(coursesData);
        setPendingRequests(requestsData);
        alert(`All requests have been ${isApproved ? 'approved' : 'rejected'}`);
      } catch (error) {
        console.error('Error bulk handling requests:', error);
      }
    }
  };

  const filteredCourses = courses.filter(course => 
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while checking authentication
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

  // If not authenticated, don't render anything (will be redirected by middleware)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBarAdmin />
      <main className="admin-main">
        <div className="dashboard-container">
          {/* Approved Courses Panel */}
          <section className="panel courses-panel">
            <div className="panel-header" style={{ height: '150px', display: 'flex', flexDirection: 'column' }}>
              <h2><i className="fas fa-book"></i> Approved Courses</h2>
              
              <div className="search-box" style={{ width: '13.5rem' }}>
                <input 
                  type="text" 
                  id="searchBar" 
                  placeholder="Search courses..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <div>
                <button 
                  id="approveAll" 
                  style={{ borderRadius: '1rem', backgroundColor: 'red', color: 'white', cursor: 'pointer' }}
                  onClick={() => handleBulkCourseUpdate(true)}
                >
                  Approve All
                </button>
                <button 
                  id="rejectAll" 
                  style={{ borderRadius: '1rem', backgroundColor: 'red', color: 'white', cursor: 'pointer' }}
                  onClick={() => handleBulkCourseUpdate(false)}
                >
                  Reject All
                </button>
              </div>
            </div>
            <div className="panel-content" id="courses-container">
              {filteredCourses.length === 0 ? (
                <p className="no-results">No courses found</p>
              ) : (
                filteredCourses.map(course => (
                  <div key={course.course_number} className="course-card" data-id={course.course_number}>
                    <h3>{course.course_name}</h3>
                    <div className="course-meta">
                      <p><strong>Code:</strong> {course.course_number}</p>
                      <p><strong>Instructor:</strong> {
                        users.find(user => user.username === course.course_instructor)?.name || 
                        course.course_instructor || 
                        'Not Assigned'
                      }</p>
                      <p><strong>Capacity:</strong> {course.registeredStudents || 0}/{course.capacity}</p>
                      <p><strong>Category:</strong> {course.category}</p>
                      <p><strong>Status:</strong> {course.isOpen ? '✅ Available' : '❌ Not Available'}</p>
                    </div>
                    <div className="course-actions">
                      <button 
                        className={`btn-toggle-approve ${course.isOpen ? 'approved' : ''}`}
                        onClick={() => handleToggleApproval(course.course_number, !course.isOpen)}
                      >
                        <i className={`fas ${course.isOpen ? 'fa-times' : 'fa-check'}`}></i>
                        {course.isOpen ? 'Disapprove' : 'Approve'}
                      </button>
                      <button 
                        className="btn-update" 
                        onClick={() => router.push(`/create-course?courseID=${course.course_number}&edit=true`)}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteCourse(course.course_number)}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Pending Requests Panel */}
          <section className="panel requests-panel">
            <div className="panel-header" style={{ height: '75px', display: 'flex', flexDirection: 'column' }}>
              <h2><i className="fas fa-clock"></i> Pending Requests</h2>
              <span className="badge" id="pending-count">{pendingRequests.length}</span>
              <div style={{ gap: '0.3rem' }}>
                <button 
                  id="approveAllst" 
                  style={{ borderRadius: '1rem', backgroundColor: 'red', color: 'white', cursor: 'pointer' }}
                  onClick={() => handleBulkRequestUpdate(true)}
                >
                  Approve All
                </button>
                <button 
                  id="rejectAllst" 
                  style={{ borderRadius: '1rem', backgroundColor: 'red', color: 'white', cursor: 'pointer' }}
                  onClick={() => handleBulkRequestUpdate(false)}
                >
                  Reject All
                </button>
              </div>
            </div>
            
            <div className="panel-content" id="requests-container">
              {pendingRequests.length === 0 ? (
                <p className="no-results" style={{ color: 'black' }}>No pending requests</p>
              ) : (
                pendingRequests.map(request => (
                  <div 
                    key={`${request.pendingBy.id}-${request.courseId}`} 
                    className="request-card" 
                    data-id={request.course.course_number} 
                    data-student={request.pendingBy.username}
                  >
                    <div className="student-info">
                      <div className="student-avatar">
                        {request.pendingBy.name?.charAt(0).toUpperCase() || request.pendingBy.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{request.pendingBy.name || request.pendingBy.username}</strong>
                      </div>
                    </div>
                    <h3>{request.course.course_name}</h3>
                    <div className="course-meta">
                      <p><strong>Code:</strong> {request.course.course_number}</p>
                      <p><strong>Requested:</strong> {new Date(request.timestamp || Date.now()).toLocaleDateString()}</p>
                    </div>
                    <div className="course-actions">
                      <button 
                        className="btn-approve" 
                        onClick={() => handleRequestAction(request.pendingBy.id, request.course.course_number, true)}
                      >
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button 
                        className="btn-reject" 
                        onClick={() => handleRequestAction(request.pendingBy.id, request.course.course_number, false)}
                      >
                        <i className="fas fa-times"></i> Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}