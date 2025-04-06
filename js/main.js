console.log("connected");

// Global Variables
let studentCourses = {
  completed: [],
  current: [],
  pending: []
};
let isRegistrationView = false;
let courses = [];
const textField = document.querySelector("#cards");
const search = document.querySelector("#searchBar");
const regBtn = document.querySelector("#regnav");

// Main Initialization
function initializeApp() {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      window.location.href = 'login.html';
      return;
    }

    // Load data from localStorage
    courses = JSON.parse(localStorage.getItem('courses')) || [];
    
    // Get student courses from localStorage
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const student = allUsers.find(u => u.username === currentUser.username && u.userType === "student");
    
    if (student) {
      studentCourses = {
        completed: student.completedCourses || [],
        current: student.currentCourses || [],
        pending: student.pendingCourses || []
      };
    }
    
    displayCourses(courses);
    allEventListeners();
  } catch (error) {
    console.error("Initialization error:", error);
    textField.innerHTML = `<p class="error">Error loading data: ${error.message}</p>`;
  }
}

// Display Functions
function displayCourses(filteredCourses) {
  if (!filteredCourses || filteredCourses.length === 0) {
    textField.innerHTML = "<p>No courses found</p>";
    return;
  }
  
  textField.innerHTML = isRegistrationView 
    ? returnCardsForReg(filteredCourses) 
    : returnCards(filteredCourses);
}

function returnCards(courses) {
  return courses.map(course => {
    const isCompleted = studentCourses.completed.some(c => c.course_number === course.course_number);
    const isCurrent = studentCourses.current.some(c => c.course_number === course.course_number);
    const isPending = studentCourses.pending.some(c => c.course_number === course.course_number);
    
    return `
      <fieldset>
        <div class="card1">
          <img class="img1" src="${course.image}" alt="${course.course_name}">
          <div class="words">
            <h3>${course.course_name} (${course.course_number})</h3>
            <p>Instructor: ${course.course_instructor}</p>
            <p>Status: ${isCompleted ? '✅ Completed' : isCurrent ? '📚 In Progress' : isPending ? '🕒 Pending' : '🔵 Available'}</p>
            <div class="action-btns">
              ${isCurrent ? `<button onclick="markCourseCompleted('${course.course_number}')">Mark Completed</button>` : ''}
            </div>
          </div>
        </div>
      </fieldset>
    `;
  }).join("");
}

function returnCardsForReg(courses) {
  return courses.map(course => {
    const eligibility = checkCourseEligibility(course);
    const availableSeats = course.capacity - (course.registeredStudents || 0);
    
    return `
      <fieldset class="${eligibility.canRegister ? '' : 'disabled-card'}">
        <div class="card1">
          <img class="img1" src="${course.image}" alt="${course.course_name}">
          <div class="words">
            <h3>${course.course_name} (${course.course_number})</h3>
            <p>Seats: ${availableSeats}/${course.capacity}</p>
            <p class="${eligibility.canRegister ? 'eligible' : 'ineligible'}">
              ${eligibility.reason}
            </p>
            <button class="${eligibility.canRegister ? '' : 'disabled'}" 
                    ${eligibility.canRegister ? `onclick="attemptRegistration('${course.course_number}')"` : 'disabled'}>
              ${eligibility.canRegister ? 'Register' : 'Cannot Register'}
            </button>
          </div>
        </div>
      </fieldset>
    `;
  }).join("");
}

// Registration Logic
function checkCourseEligibility(course) {
  if (!course.isOpen) return { canRegister: false, reason: "Registration closed" };
  if (course.capacity - course.registeredStudents <= 0) return { canRegister: false, reason: "Course full" };
  if (studentCourses.current.some(c => c.course_number === course.course_number)) return { canRegister: false, reason: "Already enrolled" };
  if (studentCourses.pending.some(c => c.course_number === course.course_number)) return { canRegister: false, reason: "Pending approval" };
  
  const prereqCheck = checkPrerequisites(course.prerequisite);
  if (!prereqCheck.canRegister) return prereqCheck;
  
  return { canRegister: true, reason: "Eligible to register" };
}

function checkPrerequisites(prerequisite) {
  if (!prerequisite?.trim()) return { canRegister: true, reason: "No prerequisites" };
  
  const missing = studentCourses.completed.filter(c => 
    !prerequisite.split(',').map(p => p.trim()).includes(c.course_number)
  );
  
  if (missing.length > 0) return { canRegister: false, reason: `Missing: ${missing.map(c => c.course_number).join(', ')}` };
  return { canRegister: true, reason: "Prerequisites met" };
}

// State Management (Updates localStorage)
function attemptRegistration(courseNumber) {
  const course = courses.find(c => c.course_number === courseNumber);
  if (!course) return alert("Course not found");

  // Update courses
  course.registeredStudents++;
  localStorage.setItem('courses', JSON.stringify(courses));

  // Update user
  const allUsers = JSON.parse(localStorage.getItem('users'));
  const user = allUsers.find(u => u.username === JSON.parse(localStorage.getItem('currentUser')).username);
  
  user.pendingCourses.push({
    course_number: course.course_number,
    course_name: course.course_name,
    status: "Pending"
  });
  
  localStorage.setItem('users', JSON.stringify(allUsers));
  updateLocalState();
  displayCourses(courses);
  alert(`Registered for ${course.course_name}!`);
}

function markCourseCompleted(courseNumber) {
  const allUsers = JSON.parse(localStorage.getItem('users'));
  const user = allUsers.find(u => u.username === JSON.parse(localStorage.getItem('currentUser')).username);
  
  // Move from current to completed
  const courseIndex = user.currentCourses.findIndex(c => c.course_number === courseNumber);
  if (courseIndex !== -1) {
    const completedCourse = user.currentCourses.splice(courseIndex, 1)[0];
    user.completedCourses.push(completedCourse);
    localStorage.setItem('users', JSON.stringify(allUsers));
    updateLocalState();
    displayCourses(courses);
  }
}

function approvePendingCourse(courseNumber) {
  const allUsers = JSON.parse(localStorage.getItem('users'));
  const user = allUsers.find(u => u.username === JSON.parse(localStorage.getItem('currentUser')).username);
  
  // Move from pending to current
  const pendingIndex = user.pendingCourses.findIndex(c => c.course_number === courseNumber);
  if (pendingIndex !== -1) {
    const approvedCourse = user.pendingCourses.splice(pendingIndex, 1)[0];
    user.currentCourses.push(approvedCourse);
    localStorage.setItem('users', JSON.stringify(allUsers));
    updateLocalState();
    displayCourses(courses);
  }
}

function updateLocalState() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const allUsers = JSON.parse(localStorage.getItem('users')) || [];
  const student = allUsers.find(u => u.username === currentUser.username);
  
  studentCourses = {
    completed: student.completedCourses || [],
    current: student.currentCourses || [],
    pending: student.pendingCourses || []
  };
}

// Event Listeners
function allEventListeners() {
  search.addEventListener("input", () => {
    const searchText = search.value.toLowerCase();
    const filteredCourses = courses.filter(course => 
      course.course_name.toLowerCase().includes(searchText) ||
      course.course_number.toLowerCase().includes(searchText)
    );
    displayCourses(filteredCourses);
  });

  regBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isRegistrationView = true;
    displayCourses(courses);
  });

  document.querySelector("#dropdownR").addEventListener("change", (e) => {
    const filteredCourses = courses.filter(c => {
      if (e.target.value === "completed") return studentCourses.completed.some(sc => sc.course_number === c.course_number);
      if (e.target.value === "progress") return studentCourses.current.some(sc => sc.course_number === c.course_number);
      if (e.target.value === "pending") return studentCourses.pending.some(sc => sc.course_number === c.course_number);
      return true;
    });
    displayCourses(filteredCourses);
  });

  document.getElementById('homenav').addEventListener('click', (e) => {
    e.preventDefault();
    isRegistrationView = false;
    displayCourses(courses);
  });

  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
    localStorage.removeItem("currentUser")
  });
}

// Initialize
initializeApp();