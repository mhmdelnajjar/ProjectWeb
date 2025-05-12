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
          <img src="https://media-hosting.imagekit.io/a086cbbc74ab43c8/qu-logo-small.png?Expires=1841677972&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Gi5xdMBev1avYk7RXcCH1IUxJBtA1rjPYtAe7PXwVTkYgNWHCKMUn9wQ~A8e04-J4Ln5PbAkpwj~2TMzqkCIzlKG0XQtjk7OP5IOWXnk3T9gcH719uDn762juKiFQjfwzdXrnSt-wdP31e9gLyq~VFWecfMkaVoka2FzmFQrmJZk-z~5YEngLp43tAojpmVGojs2lABB9K72rxkJXe3YurgdlDevjXzryIw6jIIeyH~4CwFlh6V7XjgQzOlNUCecgoIodVO3VNEhJQKv8tXHYl9ayGITaC6IU-~jiv9zwCvwkpW9TeX9hI~tC0Ag126OJXf5Wa07WrvxwKONBhIJsg__" alt="QU CSE" className="navbar-logo" />
        <h1 className="cse">CSE Registration</h1>
        <button className="logout-button" onClick={handleLogout}>
          <i className="fa fa-sign-out-alt"></i> 
          <span className="logoutword">Logout</span>
        </button>
      </div>
    </header>
  )
}
