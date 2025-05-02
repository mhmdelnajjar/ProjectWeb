import React from 'react';

export default function AdminDashboard() {
  return (
    <div>
      <header className="admin-header">
        <div className="header-content">
          <img className="logo" src="/media/cse-logo.png" alt="QU CSE" />
          <h1 className="cseadmin">CSE Admin Dashboard</h1>
          <button className="logout-button">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
        <nav className="admin-nav">
          <ul>
            <li>
              <a href="#" className="active">
                <i className="fas fa-home"></i> Dashboard
              </a>
            </li>
            <li>
              <a href="createCourseForm.html">
                <i className="fas fa-plus-circle"></i> Create Course
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="admin-main">
        <div className="dashboard-container">
          {/* Approved Courses Panel */}
          <section className="panel courses-panel">
            <div className="panel-header" style={{ height: '150px', display: 'flex', flexDirection: 'column' }}>
              <h2>
                <i className="fas fa-book"></i> Approved Courses
              </h2>
              
              <div className="search-box" style={{ width: '13.5rem' }}>
                <input type="text" id="searchBar" placeholder="Search courses..." />
                <button className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <div>
                <button
                  id="approveAll"
                  style={{ borderRadius: '1rem', backgroundColor: 'red', color: 'white', cursor: 'pointer' }}
                >
                  Approve All
                </button>
                <button
                  id="rejectAll"
                  style={{ borderRadius: '1rem', backgroundColor: 'red', color: 'white', cursor: 'pointer' }}
                >
                  Reject All
                </button>
              </div>
            </div>
            <div className="panel-content" id="courses-container">
              {/* Courses will be loaded here */}
            </div>
          </section>

          {/* Pending Requests Panel */}
          <section className="panel requests-panel">
            <div className="panel-header" style={{ height: '75px', display: 'flex', flexDirection: 'column' }}>
              <h2>
                <i className="fas fa-clock"></i> Pending Requests
              </h2>
    
              <span className="badge" id="pending-count">0</span>
              <div style={{ gap: '0.3rem' }}>
                <button
                  id="approveAllst"
                  style={{ borderRadius: '1rem', backgroundColor: 'red', color: 'white', cursor: 'pointer' }}
                >
                  Approve All
                </button>
                <button
                  id="rejectAllst"
                  style={{ borderRadius: '1rem', backgroundColor: 'red', color: 'white', cursor: 'pointer' }}
                >
                  Reject All
                </button>
              </div>
            </div>
            
            <div className="panel-content" id="requests-container">
              {/* Pending requests will be loaded here */}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

