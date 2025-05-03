'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
export default function NavBar() {
  const router = new useRouter()
  return (
    
 <header className="header">
        <div id="title" className="title">
          <img src="@/media/cse-logo.png" alt="QU CSE" className="logo"/>
          <h1 className="cse">CSE Registration</h1>
          <button className="logout-button"  onClick={e=> {
              sessionStorage.clear();
              router.push("/")
            }}>
            <i className="fa fa-sign-out-alt"></i> 
            <span className="logoutword">Logout</span>
          </button>
        </div>
        
      </header>
      

  
  )
}
