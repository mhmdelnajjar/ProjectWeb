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
    try {
        if (localStorage.courses) {
            courses = JSON.parse(localStorage.courses);
        } else {
            const response = await fetch("jsons/courses.json");
            const data = await response.json();
            courses = data.courses; // Access the courses array from the response
            localStorage.courses = JSON.stringify(courses) // Store the entire response
        }
        displayCourses(courses);
    } catch (error) {
        console.error("Error loading courses:", error);
        textField.innerHTML = "<p>Error loading courses. Please try again later.</p>";
    }
}

// Function to display courses as cards
function displayCourses(filteredCourses) {
    textField.innerHTML = filteredCourses.length 
        ? (isRegistrationView ? returnCardsForReg(filteredCourses) : returnCards(filteredCourses))
        : "<p>No courses found</p>";
}

// Function to return HTML for normal course cards
function returnCards(courses) {
    return courses.map(course => `
        <fieldset>
            <div class="card">
                <img class="img1" src="${course.image}" alt="${course.course_name}">
                <div class="words">
                    <h3>${course.course_name}</h3>
                    <h4>${course.course_number}</h4>
                    <p><strong>Instructor:</strong> ${course.course_instructor}</p>
                    <p><strong>Category:</strong> ${course.category}</p>
                    <p><strong>Prerequisites:</strong> ${course.prerequisite || "None"}</p>
                    <p><strong>Seats:</strong> ${course.registeredStudents}/${course.capacity}</p>
                    <p><strong>Status:</strong> ${course.isOpen ? "Open" : "Closed"}</p>
                </div>
            </div>
        </fieldset>
    `).join("");
}

function hasCompletedCourse(courseNumber) {
    return (studentCourses.completed || []).some(
      c => c.course_number.trim().toUpperCase() === courseNumber.trim().toUpperCase()
    );
  }
  
// Helper function to check passing grade
function hasPassedCourse(courseNumber) {
    const course = studentCourses.completed.find(c => c.course_number== courseNumber);
    if (!course) return false;
    
    const passingGrades = ["A","B","C","D"];
    return passingGrades.includes(course.grade);
  }
  
  // Updated prerequisite checking
  function checkPrerequisites(prerequisiteString) {
    // Handle empty or undefined prerequisite string
    if (!prerequisiteString || prerequisiteString.trim() === "") {
        return { canRegister: true, reason: "No prerequisites" };
    }

    // Split the string by commas and clean up the results
    const prereqs = prerequisiteString.split(",")
        .map(p => p.trim())  // Remove whitespace
        .filter(p => p !== "");  // Remove empty strings

    console.log("Parsed prerequisites:", prereqs); // Debug log

    const missing = [];
    const failed = [];

    for (const prereq of prereqs) {
        if (!hasCompletedCourse(prereq)) {
            missing.push(prereq);
        } else if (!hasPassedCourse(prereq)) {
            failed.push(prereq);
        }
    }

    if (failed.length > 0) {
        return {
            canRegister: false,
            reason: `Failed prerequisites: ${failed.join(", ")}`
        };
    }
    
    if (missing.length > 0) {
        return {
            canRegister: false,
            reason: `Missing prerequisites: ${missing.join(", ")}`
        };
    }
    
    return { canRegister: true, reason: "All prerequisites met" };
}
  

  
// Updated checkCourseEligibility 
function checkCourseEligibility(course) {
    // Check prerequisites first
    const prereqCheck = checkPrerequisites(course.prerequisite);
    if (!prereqCheck.canRegister) {
      return prereqCheck;
    }
  
    // Check other conditions
    const availableSeats = course.capacity - course.registeredStudents;
    if (availableSeats <= 0) {
      return {
        canRegister: false,
        reason: "Course is full"
      };
    }
  
    if (!course.isOpen) {
      return {
        canRegister: false,
        reason: "Registration closed"
      };
    }
  
    if (studentCourses.current.some(c => c.course_number === course.course_number)) {
      return {
        canRegister: false,
        reason: "Already enrolled"
      };
    }
  
    if (studentCourses.pending.some(c => c.course_number === course.course_number)) {
      return {
        canRegister: false,
        reason: "Pending approval"
      };
    }
  
    return {
      canRegister: true,
      reason: "Eligible to register"
    };
  }
function returnCardsForReg(courses) {
    return courses.map(course => {
      const eligibility = checkCourseEligibility(course);
      const availableSeats = course.capacity - (course.registeredStudents || 0);
      
      return `
        <fieldset class="course-card ${eligibility.canRegister ? '' : 'disabled-card'}">
          <div class="card">
            <img class="img1" src="${course.image}" alt="${course.course_name}">
            <div class="words">
              <h3>${course.course_name}</h3>
              <h4>${course.course_number}</h4>
              <p><strong>Instructor:</strong> ${course.course_instructor}</p>
              <p><strong>Seats:</strong> ${availableSeats}/${course.capacity}</p>
              <p class="eligibility-status ${eligibility.canRegister ? 'eligible' : 'ineligible'}">
                ${eligibility.reason}
              </p>
            </div>
            <button class="register-btn ${eligibility.canRegister ? '' : 'disabled'}" 
                    onclick="${eligibility.canRegister ? `attemptRegistration('${course.course_number}')` : ''}">
              ${eligibility.canRegister ? 'Register' : 'Cannot Register'}
            </button>
          </div>
        </fieldset>
      `;
    }).join("");
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
    
    // Add to pending (in real app, send to server)
    studentCourses.pending.push({
      course_number: course.course_number,
      course_name: course.course_name,
      instructor: course.course_instructor,
      status: "Pending Approval"
    });
    
    alert(`Successfully requested registration for ${course.course_name}`);
    displayCourses(courses); // Refresh view
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
