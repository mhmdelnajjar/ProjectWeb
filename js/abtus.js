console.log("connected");


document.getElementById('abtus').addEventListener('click', function(event) {
    event.preventDefault();
    document.write(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - Computer Science at QU</title>
    <link rel="stylesheet" href="styles/aboutus.css">
</head>
<body>
    <header>
        <div id="title">
            <img src="./media/cse-logo.png" alt="QU CSE">
            <h1>CSE Registration</h1>
        </div>
        <nav class="navcontainer">
            <ul>
                <li><a href="">SUBMIT GRADES</a></li>
                <li><a id="abtus" href="#">ABOUT US</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <div class="about-container" id="aboutSection">
            <div class="headmessage">
            <h2>About Computer Science at Qatar University</h2>
            <p>The Computer Science program at Qatar University provides students with the knowledge and skills needed for a successful career in computing. The program covers topics such as artificial intelligence, cybersecurity, software engineering, and data science. It is designed to meet international standards and prepares graduates for both industry and research.</p>
            </div>
            <div class="instructors-grid">
                <div class="card1">
                    <h3>Dr. Mahmoud Barhamgi</h3>
                    <p>Associate Professor in Computer Sciencet</p>
                    <p>Teaches: Web Development</p>
                    <img src="https://www.qu.edu.qa/SiteImages/static_file/qu/colleges/engineering/departments/cse/images/Mahmoud_Barhamgi.png?csf=1&e=9RvgKr" alt="">
                </div>
                <div class="card1">
                    <h3>Mr. Abdulahi Mohammed</h3>
                    <p>Bch in web dev</p>
                    <p>Teaches: Web Development</p>
                    <img src="https://media.licdn.com/dms/image/v2/C4E03AQHVRLl5K0Z0yw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1523661783694?e=2147483647&v=beta&t=OwyfGzLYWmxXxvIAnf4an_TK3KiHXjfdD-A58Cp2u44" alt="">
                </div>
                
            </div>
        </div>
    </main>
    <footer>
        <div id="keep-updated">
            <h2>Keep Updated</h2>
            <ul id="socials">
                <a href="https://www.instagram.com/qu_ceng/?hl=en">
                  <img src="./media/icons/brand-instagram.svg" alt="instagram">Instagram
                </a>
                <a href="https://www.facebook.com/p/CSE-at-Qatar-University-100057278927479/">
                  <img src="./media/icons/brand-facebook.svg" alt="facebook">Facebook
                </a>
                <a href="https://x.com/quceng?lang=en">
                  <img src="./media/icons/brand-x.svg" alt="x">X
                </a>
                <a href="https://www.tiktok.com/@qatar_university">
                  <img src="./media/icons/brand-tiktok.svg" alt="tiktok">Tiktok
                </a>
                <a href="https://www.youtube.com/c/qataruniversity/videos">
                    <img src="./media/icons/brand-youtube.svg" alt="youtube">YouTube
                </a>
                <a href="https://www.qu.edu.qa/en-us/">
                    <img src="./media/icons/world-www.svg" alt="QU website">QU website
                </a>
            </ul>
        </div>
        <div id="contact">
            <h2>Contact CSE Department</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicinge lit. Blanditiis, voluptatum?</p>
            <p>© 2025 Qatar University, All Rights Reserved</p>
        </div>
    </footer>

    <script src="js/abtus.js"></script>

</body>

</html>
        `)  
   
});

document.getElementById('homenav').addEventListener('click', function(event) {
    event.preventDefault();  
    window.location.href = 'main.html';
});
document.getElementById('regnav').addEventListener('click', function(event) {
    event.preventDefault();  
    alert("please go to home page first")
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
