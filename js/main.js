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
  // Filter to only show approved courses (isOpen: true)
  const approvedCourses = (filteredCourses || courses).filter(course => course.isOpen);
  
  if (!approvedCourses || approvedCourses.length === 0) {
    textField.innerHTML = "<p>No available courses found</p>";
    return;
  }
  
  textField.innerHTML = isRegistrationView 
    ? returnCardsForReg(approvedCourses) 
    : returnCards(approvedCourses);
}

function returnCards(courses) {
  return courses.map(course => {
    const isCompleted = studentCourses.completed.some(c => c.course_number === course.course_number);
    const isCurrent = studentCourses.current.some(c => c.course_number === course.course_number);
    const isPending = studentCourses.pending.some(c => c.course_number === course.course_number);
    
    const studentCourseRecord = studentCourses.completed.find(c => c.course_number === course.course_number) || 
                              studentCourses.current.find(c => c.course_number === course.course_number);
    
    const gradeDisplay = isCompleted && studentCourseRecord?.grade 
      ? `<p class="grade-display">Grade: ${studentCourseRecord.grade}</p>` 
      : '';
    
    let statusText = '🔵 Available';
    if (isCompleted) statusText = '✅ Completed';
    else if (isCurrent) statusText = '📚 Registered';
    else if (isPending) statusText = '⏳ Pending Approval';
    
    return `
      <fieldset>
        <div class="card1">
          <img class="img1" src="${course.image}" alt="${course.course_name}">
          <div class="words">
            <h3>${course.course_name} (${course.course_number})</h3>
            <p>Instructor: ${course.course_instructor}</p>
            <p>Status: ${statusText}</p>
            ${gradeDisplay}
          </div>
        </div>
      </fieldset>
    `;
  }).join("");
}

function returnCardsForReg(courses) {
  return courses.filter(course => course.isOpen).map(course => {
    const isRegistered = studentCourses.current.some(c => c.course_number === course.course_number);
    const isPending = studentCourses.pending.some(c => c.course_number === course.course_number);
    const eligibility = isRegistered || isPending ? 
      { canRegister: false, reason: isRegistered ? "Already registered" : "Pending approval" } : 
      checkCourseEligibility(course);
    
    const availableSeats = course.capacity - (course.registeredStudents || 0);
    
    return `
      <fieldset class="${eligibility.canRegister ? '' : 'disabled-card'}">
        <div class="card1">
          <img class="img1" src="${course.image}" alt="${course.course_name}">
          <div class="words">
            <h3>${course.course_name} (${course.course_number})</h3>
            <p>Seats: ${availableSeats}/${course.capacity}</p>
            <p class="${eligibility.canRegister ? 'eligible' : 'ineligible'}">
              ${isRegistered ? 'Already registered' : isPending ? 'Pending approval' : eligibility.reason}
            </p>
            <button id="btnreg" class="${eligibility.canRegister ? '' : 'disabled'}" 
                    ${eligibility.canRegister ? `onclick="attemptRegistration('${course.course_number}')"` : 'disabled'}>
              ${isRegistered ? 'Registered' : isPending ? 'Pending' : eligibility.canRegister ? 'Register' : 'Cannot Register'}
            </button>
          </div>
        </div>
      </fieldset>
    `;
  }).join("");
}

// Registration Logic
function checkCourseEligibility(course) {
  if (!course.isOpen) return { canRegister: false, reason: "Course not available" };
  if (course.capacity - (course.registeredStudents || 0) <= 0) {
    return { canRegister: false, reason: "Course full" };
  }
  if (studentCourses.current.some(c => c.course_number === course.course_number)) {
    return { canRegister: false, reason: "Already registered" };
  }
  if (studentCourses.pending.some(c => c.course_number === course.course_number)) {
    return { canRegister: false, reason: "Pending approval" };
  }
  
  const ifTaken = studentCourses.completed.find(c => c.course_number === course.course_number);
  if (ifTaken) return {
    canRegister: false, 
    reason: "Course already taken"
  };
  
  return checkPrerequisites(course.prerequisite);
}

function checkPrerequisites(prerequisite) {
  if (!prerequisite?.trim()) return { canRegister: true, reason: "No prerequisites" };
  
  const requiredCourses = prerequisite.split(',').map(p => p.trim());
  
  for (const requiredCourse of requiredCourses) {
    const completedCourse = studentCourses.completed.find(c => 
      c.course_number === requiredCourse.split(":")[1]
    );
    
    // Check if prerequisite was completed with passing grade
    if (!completedCourse || completedCourse.grade === 'F') {
      return { 
        canRegister: false, 
        reason: `Missing or failed prerequisite: ${requiredCourse.split(":")[0]}`
      };
    }
  }
  
  return { canRegister: true, reason: "Prerequisites met" };
}

function attemptRegistration(courseNumber) {
  const course = courses.find(c => c.course_number === courseNumber);
  if (!course) return;
  
  // Verify eligibility again
  const eligibility = checkCourseEligibility(course);
  if (!eligibility.canRegister) {
    alert(`Cannot register: ${eligibility.reason}`);
    return;
  }
  
  // Get current user and all users
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const allUsers = JSON.parse(localStorage.getItem('users')) || [];
  const student = allUsers.find(u => u.username === currentUser.username);
  
  if (!student) return;
  
  // Initialize arrays if they don't exist
  if (!student.pendingCourses) student.pendingCourses = [];
  if (!course.registeredStudents) course.registeredStudents = 0;
  
  // Add to pending courses
  student.pendingCourses.push({
    course_number: course.course_number,
    course_name: course.course_name,
    course_instructor: course.course_instructor,
    status: "Pending"
  });
  
  // Update course registration count
  course.registeredStudents++;
  
  // Save updates
  localStorage.setItem('users', JSON.stringify(allUsers));
  localStorage.setItem('courses', JSON.stringify(courses));
  
  // Update local state and UI
  updateLocalState();
  displayCourses(courses);
  alert(`Registration request for ${course.course_name} submitted for approval!`);
}

function updateLocalState() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const allUsers = JSON.parse(localStorage.getItem('users')) || [];
  const student = allUsers.find(u => u.username === currentUser.username);
  
  if (student) {
    studentCourses = {
      completed: student.completedCourses || [],
      current: student.currentCourses || [],
      pending: student.pendingCourses || []
    };
  }
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
  });
}

// Initialize
initializeApp();