'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'

export default function NavBar() {
  const router = useRouter()
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("user");
    // Remove JWT token
    Cookies.remove("token");
    // Redirect to login
    router.push('/');
  };
  return (
    <header className="header">
      <div id="title" className="title">
        <img src="@/media/cse-logo.png" alt="QU CSE" className="logo"/>
        <h1 className="cse">CSE Registration</h1>
        <button className="logout-button" onClick={handleLogout}>
          <i className="fa fa-sign-out-alt"></i> 
          <span className="logoutword">Logout</span>
        </button>
      </div>
    </header>
  )
}
