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
            <div class="card1">
                <img class="img1" src="${e.image}" alt="${e.course_name}">
                <div class="words">
                    <h3> COURSE NAME: ${e.course_name}</h3>
                    <br>
                    <h4> COURSE NUMBER: ${e.course_number}</h4>
                    <br>                    
                    <p> PREREQUISITE: ${e.prerequisite}</p>
                    <br>
                    <p> CATEGORY: ${e.category}</p>
                    <br>
                    <div> <p> CAPACITY: </p> ${e.capacity}</div>
                    <br>
                </div>
                <div class="action-btns">
        <button class="btn-register" id="btn-register"> <i class="fa fa-pencil"></i> Register</button>
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

document.getElementById('abtus').addEventListener('click', function(event) {
    event.preventDefault();  
    window.location.href = 'aboutus.html';
});

document.getElementById('homenav').addEventListener('click', function(event) {
    event.preventDefault();  
    window.location.href = 'home.html';
});
document.getElementById('regnav').addEventListener('click', function(event) {
    event.preventDefault();  
    window.location.href = 'main.html';
});

// Load courses when the script runs
loadCourse();
