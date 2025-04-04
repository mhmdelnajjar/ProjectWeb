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
        <button class="btn-update" id="btn-update"> <i class="fa fa-pencil"></i> Update</button>
        <button class="btn-delete" id="btn-delete"> <i class="fa fa-trash"></i> Delete</button>
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






// async function updateCourse(courseID) {
//     const mainContent = document.getElementById('main-content');
//     const page = await fetch("edit_page.html")
//     const pageHTMLContent = await page.text()
//     mainContent.innerHTML = pageHTMLContent;
//     recipeNEW=recipeID-1;
//     document.getElementById("recipe-name").value=recipeslist[recipeNEW].name;
//     document.getElementById("recipe-img").value=recipeslist[recipeNEW].image;
//     document.getElementById("recipe-ingredients").value=recipeslist[recipeNEW].ingredients;
//     document.getElementById("recipe-instructions").value=recipeslist[recipeNEW].instructions;
//     document.getElementById("add-recipe-btn").value="update recipe"

//   let updateBtn = document.getElementById("add-recipe-form");

//   updateBtn.addEventListener("submit", function () {
//       saveUpdatedRecipe(recipeID);
//   });
// }

// function saveUpdatedRecipe(recipeID) {
 
//     // Map form data keys to the expected keys
//     const newRecipe = {
//       name: document.getElementById("recipe-name").value, 
//       image: document.getElementById("recipe-img").value, 
//       ingredients: document.getElementById("recipe-ingredients").value,
//       instructions: document.getElementById("recipe-instructions").value, 
//     };
  
  
//     const recipeIndex = recipeslist.findIndex((recipe) => recipe.id == recipeID);
    
//     recipeslist.splice(recipeIndex, 1, newRecipe);
//     localStorage.setItem("recipes", JSON.stringify(recipeslist));
//     showGrid();
//   }
  
  