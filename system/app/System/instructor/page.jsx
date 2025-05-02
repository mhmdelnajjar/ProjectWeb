import React from 'react';


export default function InstructorPortal() {
  const logout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  return (
    <div>
      <header>
        <div id="title">
          <div id="title">
            <img className="logo" src="/media/cse-logo.png" alt="QU CSE" />
            <h1 className="cse">CSE Registration</h1>
            
            <button id="logoutBtn" className="logout-button">
              <p className="logoutword">Logout</p>
            </button>
          </div>
        </div>
      </header>
      
      <main>
        <div className="courses-list">
          <div className="course-item">
            <span>Course Name</span>
            <button className="btn-view-students">View Students</button>
          </div>
        </div>
        
        <div className="students-table">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="students-container">
              {/* Students will be loaded here */}
            </tbody>
          </table>
        </div>
      </main>
      
      <footer>
        <div id="keep-updated">
          <h2>Keep Updated</h2>
          <ul id="socials">
            <a href="https://www.instagram.com/qu_ceng/?hl=en">
              <img src="/media/icons/brand-instagram.svg" alt="instagram" />Instagram
            </a>
            <a href="https://www.facebook.com/p/CSE-at-Qatar-University-100057278927479/">
              <img src="/media/icons/brand-facebook.svg" alt="facebook" />Facebook
            </a>
            <a href="https://x.com/quceng?lang=en">
              <img src="/media/icons/brand-x.svg" alt="x" />X
            </a>
            <a href="https://www.tiktok.com/@qatar_university">
              <img src="/media/icons/brand-tiktok.svg" alt="tiktok" />Tiktok
            </a>
            <a href="https://www.youtube.com/c/qataruniversity/videos">
              <img src="/media/icons/brand-youtube.svg" alt="youtube" />YouTube
            </a>
            <a href="https://www.qu.edu.qa/en-us/">
              <img src="/media/icons/world-www.svg" alt="QU website" />QU website
            </a>
          </ul>
        </div>
        <div id="contact">
          <h2>Contact CSE Department</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, voluptatum?</p>
          <p>© 2025 Qatar University, All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}