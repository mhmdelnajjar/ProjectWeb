import React from 'react'

export default function NavBarInst() {
  return (
    <header className="header">
    <div id="title" className="title">
    
        <img className="logo" src="/media/cse-logo.png" alt="QU CSE" />
        <h1 className="cse">CSE Registration</h1>
        
        <button id="logoutBtn" className="logout-button">
          <p className="logoutword">Logout</p>
        </button>
      </div>
  
  </header>
  )
}
