// DOM Elements
const coursesContainer = document.getElementById('courses-container');
const requestsContainer = document.getElementById('requests-container');
const pendingCount = document.getElementById('pending-count');
const searchBar = document.getElementById('searchBar');

// State
let courses = [];
let pendingRequests = [];


// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadData();
    setupEventListeners();
});

// Check authentication
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.userType !== 'admin') {
        window.location.href = 'login.html';
    }
}

// Load all data
async function loadData() {
    try {
    
        if (localStorage.courses) {
            courses = JSON.parse(localStorage.courses);
        } else {
            const response = await fetch('jsons/courses.json');
            courses = await response.json();
            localStorage.courses = JSON.stringify(courses);
        }
        
        // Load pending requests
        loadPendingRequests();
        
        // Render data
        renderCourses(courses);
        renderPendingRequests(pendingRequests);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load pending requests from students
function loadPendingRequests() {
    const users = JSON.parse(localStorage.users || '[]');
    pendingRequests = [];
    
    users.forEach(user => {
        if (user.userType === 'student' && user.pendingCourses && user.pendingCourses.length > 0) {
            user.pendingCourses.forEach(course => {
                pendingRequests.push({
                    ...course,
                    student: {
                        username: user.username,
                        name: user.name || user.username
                    }
                });
            });
        }
    });
    
    pendingCount.textContent = pendingRequests.length;
}

// Render courses
function renderCourses(coursesToRender) {
    if (coursesToRender.length === 0) {
        coursesContainer.innerHTML = '<p class="no-results">No courses found</p>';
        return;
    }
    
    coursesContainer.innerHTML = coursesToRender.map(course => `
        <div class="course-card" data-id="${course.course_number}">
            <h3>${course.course_name}</h3>
            <div class="course-meta">
                <p><strong>Code:</strong> ${course.course_number}</p>
                <p><strong>Instructor:</strong> ${course.course_instructor}</p>
                <p><strong>Capacity:</strong> ${course.capacity}</p>
                <p><strong>Category:</strong> ${course.category}</p>
                <p><strong>Status:</strong> ${course.isOpen ? '✅ Available' : '❌ Not Available'}</p>
            </div>
            <div class="course-actions">
                <button class="btn-toggle-approve ${course.isOpen ? 'approved' : ''}" 
                        onclick="toggleCourseApproval('${course.course_number}', ${!course.isOpen})">
                    <i class="fas ${course.isOpen ? 'fa-times' : 'fa-check'}"></i> 
                    ${course.isOpen ? 'Disapprove' : 'Approve'}
                </button>
                <button class="btn-update" onclick="editCourse('${course.course_number}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deleteCourse('${course.course_number}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}



function toggleCourseApproval(courseNumber, shouldApprove) {
    const courseIndex = courses.findIndex(c => c.course_number === courseNumber);
    if (courseIndex !== -1) {
        courses[courseIndex].isOpen = shouldApprove;
        localStorage.setItem('courses', JSON.stringify(courses));
        renderCourses(courses);
        
        // Optional: Show confirmation message
        const courseName = courses[courseIndex].course_name;
        alert(`Course "${courseName}" has been ${shouldApprove ? 'approved and made available' : 'disapproved and made unavailable'}`);
    }
}



// Edit course
function editCourse(courseNumber) {
    window.location.href = `createCourseForm.html?courseID=${encodeURIComponent(courseNumber)}&edit=true`;
}

// Delete course
function deleteCourse(courseNumber) {
    if (confirm('Are you sure you want to delete this course?')) {
        const index = courses.findIndex(c => c.course_number === courseNumber);
        if (index !== -1) {
            courses.splice(index, 1);
            localStorage.courses = JSON.stringify(courses);
            renderCourses(courses);
        }
    }
}

function approveCourse(courseNumber){}


function setupEventListeners() {
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = courses.filter(course => 
            course.course_name.toLowerCase().includes(searchTerm) ||
            course.course_number.toLowerCase().includes(searchTerm) ||
            (course.instructor && course.instructor.toLowerCase().includes(searchTerm))
        );
        renderCourses(filtered);
    });
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}







// function renderPendingRequests(requests) {
//     if (requests.length === 0) {
//         requestsContainer.innerHTML = '<p class="no-results">No pending requests</p>';
//         return;
//     }
    
//     requestsContainer.innerHTML = requests.map(request => `
//         <div class="request-card" data-id="${request.course_number}" data-student="${request.student.username}">
//             <div class="student-info">
//                 <div class="student-avatar">${request.student.name.charAt(0).toUpperCase()}</div>
//                 <div>
//                     <strong>${request.student.name}</strong>
   
//                 </div>
//             </div>
//             <h3>${request.course_name}</h3>
//             <div class="course-meta">
//                 <p><strong>Code:</strong> ${request.course_number}</p>
//                 <p><strong>Requested:</strong> ${new Date(request.timestamp || Date.now()).toLocaleDateString()}</p>
//             </div>
//             <div class="course-actions">
//                 <button class="btn-approve" onclick="handleRequest('${request.student.username}', '${request.course_number}', true)">
//                     <i class="fas fa-check"></i> Approve
//                 </button>
//                 <button class="btn-reject" onclick="handleRequest('${request.student.username}', '${request.course_number}', false)">
//                     <i class="fas fa-times"></i> Reject
//                 </button>
//             </div>
//         </div>
//     `).join('');
// }


// function handleRequest(studentUsername, courseNumber, isApproved) {
//     const users = JSON.parse(localStorage.users);
//     const userIndex = users.findIndex(u => u.username === studentUsername);
    
//     if (userIndex !== -1) {
//         const user = users[userIndex];
//         const requestIndex = user.pendingCourses.findIndex(c => c.course_number === courseNumber);
        
//         if (requestIndex !== -1) {
//             const [request] = user.pendingCourses.splice(requestIndex, 1);
            
//             if (isApproved) {
//                 // Add to current courses
//                 if (!user.currentCourses) user.currentCourses = [];
//                 user.currentCourses.push({"course_number":request.course_number,"course_name":request.course_name});
            
//                 // Update course capacity
//                 const courseIndex = courses.findIndex(c => c.course_number === courseNumber);
//                 if (courseIndex !== -1) {
//                     courses[courseIndex].capacity--;
//                     localStorage.courses = JSON.stringify(courses);
//                 }
//             }
            
//             // Update user data
//             localStorage.users = JSON.stringify(users);
            
//             // Refresh displays
//             loadPendingRequests();
//             renderCourses(courses);
//             renderPendingRequests(pendingRequests);
//         }
//     }
// }
