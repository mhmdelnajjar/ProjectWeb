console.log("connected");


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


// document.addEventListener("DOMContentLoaded", function () {
//     // Get the "About Us" button and the main content area
//     const aboutBtn = document.getElementById("abtus");
//     const mainContent = document.querySelector("main");

//     // About Us HTML content
//     const aboutUsContent = `
//         <div class="about-container" id="aboutSection">
//             <div class="headmessage">
//                 <h2>About Computer Science at Qatar University</h2>
//                 <p>The Computer Science program at Qatar University provides students with the knowledge and skills needed for a successful career in computing. The program covers topics such as artificial intelligence, cybersecurity, software engineering, and data science. It is designed to meet international standards and prepares graduates for both industry and research.</p>
//             </div>
//             <div class="instructors-grid">
//                 <div class="card1">
//                     <h3>Dr. Mahmoud Barhamgi</h3>
//                     <p>Associate Professor in Computer Science</p>
//                     <p>Teaches: Web Development</p>
//                     <img src="https://www.qu.edu.qa/SiteImages/static_file/qu/colleges/engineering/departments/cse/images/Mahmoud_Barhamgi.png?csf=1&e=9RvgKr" alt="">
//                 </div>
//                 <div class="card1">
//                     <h3>Mr. Abdulahi Mohammed</h3>
//                     <p>BSc in Web Development</p>
//                     <p>Teaches: Web Development</p>
//                     <img src="https://media.licdn.com/dms/image/v2/C4E03AQHVRLl5K0Z0yw/profile-displayphoto-shrink_200_200/0/1523661783694?e=2147483647&v=beta&t=OwyfGzLYWmxXxvIAnf4an_TK3KiHXjfdD-A58Cp2u44" alt="">
//                 </div>
//             </div>
//         </div>
//     `;

//     // Event listener for "About Us" button
//     aboutBtn.addEventListener("click", function (event) {
//         event.preventDefault(); // Prevent default link behavior
//         mainContent.innerHTML = aboutUsContent; // Replace content in <main>
//     });
// });
