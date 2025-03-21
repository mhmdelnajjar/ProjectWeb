console.log("connected");
let currCourses = []
let completedcourses = []
let pendingCourses =[]
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

//load current coureses
async function loadCurrent() {
    const req = await fetch("/jsons/users.json");
        const res = await req.json();
        const array = res.filter(e=>e.username==usernameGetten)
         const array2 = array.flatMap(user => user.courses);   
         currCourses = array2.filter(e=>e.grade=="")  
     
         
}
// load completed courses
async function loadCompleted() {
    const req = await fetch("/jsons/users.json");
        const res = await req.json();
        const array = res.filter(e=>e.username==usernameGetten)
         const array2 = array.flatMap(user => user.courses);   
         completedcourses = array2.filter(e=>e.grade!="")
        
             
           
}

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
function returnCards2(courses) {
    return courses.map((e,index) => `
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
 <button class="details-btn" onclick="addToReg(${index})">Register</button> 
  <button class="details-btn" onclick="showDetials(${index})">Show Details</button>
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
loadCurrent();
loadCompleted();
regBtn.addEventListener("click",function() {

textField.innerHTML = returnCards2(courses)


})