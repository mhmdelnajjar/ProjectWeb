document.addEventListener('DOMContentLoaded', () => {
    // 1. Check authentication
    const currentUser = JSON.parse(localStorage.currentUser || '{}');
    if (!currentUser || currentUser.userType !== 'instructor') {
        window.location.href = 'login.html';
        return;
    }

    // 2. Load data
    const usersData = JSON.parse(localStorage.users || '{}');
    const courses = JSON.parse(localStorage.courses || '[]');
    const instructor = usersData.find(u => u.username === currentUser.username);
    
    if (!instructor || !instructor.assignedCourses) {
        document.getElementById('students-container').innerHTML = '<p>No courses assigned</p>';
        return;
    }

    // 3. Find matching students
    const students = usersData
        .filter(user => user.userType === 'student' && user.currentCourses)
        .map(student => ({
            username: student.username,
            courses: student.currentCourses.filter(course => 
                instructor.assignedCourses.some(ic => ic.course_number === course.course_number)
            )
        }))
        .filter(student => student.courses.length > 0);

    // 4. Render students
    const container = document.getElementById('students-container');
    if (students.length === 0) {
        container.innerHTML = '<p>No students in your courses</p>';
        return;
    }

    container.innerHTML = students.map(student => `
        <div class="student-card">
            <h3><i>Student Name: </i>${student.username}</h3>
            ${student.courses.map(course => {
                const courseInfo = courses.find(c => c.course_number === course.course_number) || {};
                return `
                <div class="course-grade-form" data-student="${student.username}" data-course="${course.course_number}">
                    <p>${courseInfo.course_name || course.course_number} (${course.course_number})</p>
                    <select class="grade-select">
                        <option value="">Select Grade</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                    </select>
                    <button class="btn-submit-grade">Submit Grade</button>
                </div>
                `;
            }).join('')}
        </div>
    `).join('');
    document.querySelectorAll('.btn-submit-grade').forEach(button => {
        button.addEventListener('click', event => {
          const form = event.target.closest('.course-grade-form');
          const studentUsername = form.dataset.student;
          const courseNumber = form.dataset.course;
          const grade = form.querySelector('.grade-select').value;
    
          if (!grade) {
            alert('Please select a grade');
            return;
          }
    
          const usersData = JSON.parse(localStorage.getItem("users")) || [];
          const student = usersData.find(u => u.username === studentUsername);
    
          if (!student) return;
    
          const courseIndex = student.currentCourses.findIndex(c => c.course_number === courseNumber);
          if (courseIndex === -1) return;
    
          const course = student.currentCourses[courseIndex];
          course.grade = grade;
    
          student.currentCourses.splice(courseIndex, 1);
          student.completedCourses = student.completedCourses || [];
          student.completedCourses.push(course);
    
          localStorage.setItem("users", JSON.stringify(usersData));
    
          alert(`Grade ${grade} submitted for ${student.username}`);
          location.reload();
        });
    });
});