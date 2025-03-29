console.log("connected");

let studentCourses = {
  completed: [],
  current: [],
  pending: []
};
// Add this at the beginning of your main.js file (before any functions that use it)

let isRegistrationView = false
let courses = [];
const textField = document.querySelector("#cards");
const search = document.querySelector("#searchBar");
const regBtn = document.querySelector("#reg")
// 
const usernameGetten =getQueryParam("username")
// Function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function getStudentCourses(usernameGetten) {
    try {
        // Fetch user data
        const req = await fetch("jsons/users.json");
        const users = await req.json();
        const student = users.usersArray.find(s => s.username === usernameGetten);

        if (!student || student.userType !== "student") {
            console.log("Student not found or not a student account");
            return [];
        }

        // Fetch all courses
        const coursesReq = await fetch("jsons/courses.json");
        const coursesData = await coursesReq.json();
        
        // Get all courses related to the student (completed, current, and pending)
        const allStudentCourses = [
            ...(student.completedCourses || []),
            ...(student.currentCourses || []),
            ...(student.pendingCourses || [])
        ];

        // Get full course details for each student course
        const studentCoursesWithDetails = allStudentCourses.map(studentCourse => {
            const fullCourseDetails = coursesData.courses.find(
                c => c.course_number === studentCourse.course_number
            );
            
            // Determine status
            let status = "Pending";
            if (student.completedCourses?.some(c => c.course_number === studentCourse.course_number)) {
                status = "Completed";
            } else if (student.currentCourses?.some(c => c.course_number === studentCourse.course_number)) {
                status = "Enrolled";
            }

            // Merge student-specific data with course details
            return {
                ...studentCourse,
                ...fullCourseDetails,
                status: studentCourse.status || status
            };
        });

        return studentCoursesWithDetails;

    } catch (error) {
        console.error("Error fetching student courses:", error);
        return [];
    }
}

async function loadCourse() {
    if (localStorage.courses) {
        courses = JSON.parse(localStorage.courses);
    } else {
        const req = await fetch("/jsons/courses.json");
        const res = await req.json();
        localStorage.courses = JSON.stringify(res);
        courses = res;
    }
    displayCourses(courses);
}

// Function to display courses as cards
function displayCourses(filteredCourses) {

    if (isRegistrationView == false) {
    textField.innerHTML = filteredCourses.length 
        ? returnCards(filteredCourses) 
        : "<p>No courses found</p>";
    } else {
        textField.innerHTML = filteredCourses.length 
        ? returnCardsForReg(filteredCourses) 
        : "<p>No courses found</p>";
    }
}

// Function to return HTML for course cards
function returnCards(courses) {
    if (isRegistrationView==false){
    return courses.map(e => `
        <fieldset>
            <div class="card">
                <img class="img1" src="${e.image}" alt="${e.course_name}">
                <div class="words">
                    <h3>${e.course_name}</h3>
                    <h4>${e.course_number}</h4>
                    <p>${e.prerequisite}</p>
                    <p>${e.category}</p>
                    <div>${e.capacity}</div>
                </div>
            </div>
        </fieldset>
    `).join("");}
}

function returnCardsForReg(courses) {
    return courses.map((course, index) => `
        <fieldset class="course-card">
            <div class="card" onclick="showCourseDetails(${index})">
                <img class="img1" src="${course.image}" alt="${course.course_name}">
                <div class="words">
                    <h3>${course.course_name}</h3>
                    <h4>${course.course_number}</h4>
                    <p><strong>Instructor:</strong> ${course.course_instructor}</p>
                    <p><strong>Schedule:</strong> ${course.schedule || 'Not specified'}</p>
                    <p><strong>Available Seats:</strong> ${course.capacity - (course.registeredStudents || 0)}/${course.capacity}</p>
                </div>
                <button class="register-btn" onclick="event.stopPropagation(); addToReg(${index})">
                    Register
                </button>
            </div>
        </fieldset>
    `).join("");
}

let currentModal = null;

function showCourseDetails(index) {
    const course = courses[index];
    
    const modal = document.createElement('div');
    modal.className = 'course-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${course.course_name} Details</h2>
                <span class="close-modal" onclick="closeModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="course-image">
                    <img src="${course.image}" alt="${course.course_name}">
                </div>
                <div class="course-info">
                    <p><strong>Course Code:</strong> ${course.course_number}</p>
                    <p><strong>Instructor:</strong> ${course.course_instructor}</p>
                    <p><strong>Description:</strong> ${course.description || 'No description available'}</p>
                    <p><strong>Prerequisites:</strong> ${course.prerequisite || 'None'}</p>
                    <p><strong>Schedule:</strong> ${course.schedule || 'Not specified'}</p>
                    <p><strong>Credits:</strong> ${course.credits || 'N/A'}</p>
                    <p><strong>Department:</strong> ${course.department || 'General'}</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-register-btn" onclick="addToReg(${index}); closeModal()">
                    Register Now
                </button>
                <button class="modal-back-btn" onclick="closeModal()">
                    Back to Courses
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    currentModal = modal;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (currentModal) {
        document.body.removeChild(currentModal);
        currentModal = null;
        document.body.style.overflow = 'auto';
    }
}

function addToReg(index) {
    const course = courses[index];
    console.log(`Registering for ${course.course_name}`);
    isRegistrationView = false;
    displayCourses(courses);
    closeModal();
}
function allEventListners() {
search.addEventListener("input", function () {
    const searchText = search.value.toLowerCase();
    const filteredCourses = courses.filter(course => 
        course.course_name.toLowerCase().includes(searchText) ||
        course.course_number.toLowerCase().includes(searchText) ||
        course.category.toLowerCase().includes(searchText)
    );
    displayCourses(filteredCourses);
});

regBtn.addEventListener("click", function(e) {
    e.preventDefault()
    isRegistrationView = true;
    textField.innerHTML = returnCardsForReg(courses);
    
})
}




loadCourse();
allEventListners();
