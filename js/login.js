
let users = []

 
const loginBtn = document.querySelector("#loginForm");
loginBtn.addEventListener("submit", handleLogin);


async function handleLogin(e) {
    e.preventDefault()
    const jsonFile = await fetch("jsons/users.json");
    const response = await jsonFile.json();
    
users  =response
    const usernameLogged = document.querySelector("#username").value.trim()
    const passwordLogged = document.querySelector("#password").value.trim()
 

    
    validateUsers(usernameLogged,passwordLogged,users)
   
}



function validateUsers(usernameLogged,passwordLogged,users){

    
    const isFound = users.usersArray.find(user => {
        return user.username === usernameLogged && user.password === passwordLogged;
    });
    
    

    if(isFound){
        if (isFound.userType =="admin") {

        window.location.href = `admin.html?username=${encodeURIComponent(usernameLogged)}`;
        } else if (isFound.userType =="student") {
            window.location.href = `main.html?username=${encodeURIComponent(usernameLogged)}`;

        } else if (isFound.userType=="instructor") {
            window.location.href = `main.html?username=${encodeURIComponent(usernameLogged)}`;

            
        } else {
            alert("Type Were Not Found!")
        }
    } else {
alert("No Account Has Been Found Please Contact The admin!")

    }



}