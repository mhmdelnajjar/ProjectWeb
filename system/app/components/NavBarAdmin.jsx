'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function NavBarAdmin() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    Cookies.remove("token");
    router.push("/");
  };


    return (
      <header className="navbar-admin">
        <div className="navbar-top">
          <img src="https://media-hosting.imagekit.io/a086cbbc74ab43c8/qu-logo-small.png?Expires=1841677972&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Gi5xdMBev1avYk7RXcCH1IUxJBtA1rjPYtAe7PXwVTkYgNWHCKMUn9wQ~A8e04-J4Ln5PbAkpwj~2TMzqkCIzlKG0XQtjk7OP5IOWXnk3T9gcH719uDn762juKiFQjfwzdXrnSt-wdP31e9gLyq~VFWecfMkaVoka2FzmFQrmJZk-z~5YEngLp43tAojpmVGojs2lABB9K72rxkJXe3YurgdlDevjXzryIw6jIIeyH~4CwFlh6V7XjgQzOlNUCecgoIodVO3VNEhJQKv8tXHYl9ayGITaC6IU-~jiv9zwCvwkpW9TeX9hI~tC0Ag126OJXf5Wa07WrvxwKONBhIJsg__" alt="QU CSE" className="navbar-logo" />
          <h1 className="navbar-title">CSE Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
   
        <nav className="navbar-links">
          <Link href="/System/admin" className="nav-btn">
            <i className="fas fa-home"></i> Dashboard
          </Link>
          <Link href="/System/admin/create-course" className="nav-btn">
            <i className="fas fa-plus-circle"></i> Create Course
          </Link>
          <Link href="/System/status" className="nav-btn">
            <i className="fas fa-chart-bar"></i> Show Statistics
          </Link>
        </nav>
      </header>
    );
  }
