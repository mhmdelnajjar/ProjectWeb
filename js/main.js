console.log("connected");

let courses = [];
const textField = document.querySelector("#cards");
const search = document.querySelector("#searchBar");

// Load courses from localStorage or fetch from JSON
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
    textField.innerHTML = filteredCourses.length 
        ? returnCards(filteredCourses) 
        : "<p>No courses found</p>";
}

// Function to return HTML for course cards
function returnCards(courses) {
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
    `).join("");
}

// Search filter function
search.addEventListener("input", function () {
    const searchText = search.value.toLowerCase();
    const filteredCourses = courses.filter(course => 
        course.course_name.toLowerCase().includes(searchText) ||
        course.course_number.toLowerCase().includes(searchText) ||
        course.category.toLowerCase().includes(searchText)
    );
    displayCourses(filteredCourses);
});

// Load courses when the script runs
loadCourse();
