console.log("connected");

let courses = []
const textFiled = document.querySelector("#cards")

async function loadCourse() {
if (localStorage.courses) {
courses = JSON.parse(localStorage.courses)
} else {
    const req= await fetch("/jsons/courses.json")
    const res =await req.json()
    localStorage.courses = JSON.stringify(res)
}
textFiled.innerHTML = returnCards(courses)
}


function returnCards(courses) {
    console.log(courses);
    
return courses.map(e=> `
    <fieldset>
            <div class="card">
                <img class="img1" src="${e.image}">
                <div class="words">
                <h3>${e.course_name}</h3>
                <h4>${e.course_number}</h4>
                <p>${e.prerequisite}</p>
                <p>${e.category}</p>
                <div>${e.capacity}</div>
              
                </div>
        </fieldset>`
).join(" ")
}
loadCourse()