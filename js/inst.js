document.addEventListener('DOMContentLoaded', () => {
    // 1. Check authentication
    const currentUser = JSON.parse(localStorage.currentUser || '{}');
    if (!currentUser || currentUser.userType !== 'instructor') {
        window.location.href = 'login.html';
        return;
    }

    // 2. Load data
    const usersData = JSON.parse(localStorage.users || '[]');
    const courses = JSON.parse(localStorage.courses || '[]');
    const instructor = usersData.find(u => u.username === currentUser.username);
    
    if (!instructor || !instructor.assignedCourses || instructor.assignedCourses.length === 0) {
        document.getElementById('students-container').innerHTML = '<p>No courses assigned</p>';
        return;
    }

    // 3. Render instructor's courses
    renderInstructorCourses(instructor.assignedCourses, courses);
});

function renderInstructorCourses(assignedCourses, allCourses) {
    const container = document.getElementById('students-container');
    
    // Filter to only get courses this instructor teaches
    const instructorCourses = allCourses.filter(course => 
        assignedCourses.some(ac => ac.course_number === course.course_number)
    );

    if (instructorCourses.length === 0) {
        container.innerHTML = '<p>No courses found</p>';
        return;
    }

    container.innerHTML = `
        <div class="courses-list">
            <h2>Your Courses</h2>
            ${instructorCourses.map(course => `
                <div class="course-item" data-id="${course.course_number}">
                    <h3>${course.course_name} (${course.course_number})</h3>
                    <button class="btn-view-students" onclick="viewStudents('${course.course_number}')">
                        View Students
                    </button>
                </div>
            `).join('')}
        </div>
        <div id="students-table-container"></div>
    `;
}

function viewStudents(courseNumber) {
    const usersData = JSON.parse(localStorage.users || '[]');
    const course = JSON.parse(localStorage.courses || '[]').find(c => c.course_number === courseNumber);
    
    if (!course) return;

    // Find all students enrolled in this course
    const students = usersData
        .filter(user => user.userType === 'student' && user.currentCourses)
        .filter(student => 
            student.currentCourses.some(sc => sc.course_number === courseNumber)
        );

    const container = document.getElementById('students-table-container');
    
    if (students.length === 0) {
        container.innerHTML = '<p>No students enrolled in this course</p>';
        return;
    }

    container.innerHTML = `
        <div class="students-table">
            <h3>Students in ${course.course_name}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Username</th>
                        <th>Current Grade</th>
                        <th>Submit Grade</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => {
                        const courseData = student.currentCourses.find(c => c.course_number === courseNumber);
                        return `
                            <tr>
                                <td>${student.name || student.username}</td>
                                <td>${student.username}</td>
                                <td>${courseData.grade || 'Not graded'}</td>
                                <td>
                                    <select class="grade-select" id="grade-${student.username}-${courseNumber}">
                                        <option value="">Select Grade</option>
                                        <option value="A" ${courseData.grade === 'A' ? 'selected' : ''}>A</option>
                                        <option value="B" ${courseData.grade === 'B' ? 'selected' : ''}>B</option>
                                        <option value="C" ${courseData.grade === 'C' ? 'selected' : ''}>C</option>
                                        <option value="D" ${courseData.grade === 'D' ? 'selected' : ''}>D</option>
                                        <option value="F" ${courseData.grade === 'F' ? 'selected' : ''}>F</option>
                                    </select>
                                    <button class="btn-submit-grade" 
                                            onclick="submitGrade('${student.username}', '${courseNumber}')">
                                        Submit
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function submitGrade(studentUsername, courseNumber) {
    const usersData = JSON.parse(localStorage.getItem("users")) || [];
    const student = usersData.find(u => u.username === studentUsername);
    const gradeSelect = document.getElementById(`grade-${studentUsername}-${courseNumber}`);
    const grade = gradeSelect.value;

    if (!grade) {
        alert('Please select a grade');
        return;
    }

    if (!student) return;

    const courseIndex = student.currentCourses.findIndex(c => c.course_number === courseNumber);
    if (courseIndex === -1) return;

    const course = student.currentCourses[courseIndex];
    course.grade = grade;

    // Move from current to completed if the course is being graded
    student.currentCourses.splice(courseIndex, 1);
    student.completedCourses = student.completedCourses || [];
    student.completedCourses.push(course);

    localStorage.setItem("users", JSON.stringify(usersData));
    alert(`Grade ${grade} submitted for ${student.username}`);
    viewStudents(courseNumber); // Refresh the view
}