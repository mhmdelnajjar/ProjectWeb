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
      <div className="navbar-container">
        <div className="navbar-left">
          <img src="/media/cse-logo.png" alt="QU CSE" className="navbar-logo" />
        </div>

        <h1 className="navbar-title-center">CSE Admin Dashboard</h1>

        <nav className="navbar-nav">
          <li>
            <Link href="/System/admin" className="nav-link">
              <i className="fas fa-home"></i> Home
            </Link>
          </li>
          <li>
            <Link href="/System/admin/create-course" className="nav-link">
              <i className="fas fa-plus-circle"></i> Create Course
            </Link>
          </li>
          <li>
            <Link href="/System/admin/status" className="nav-link">
              <i className="fas fa-chart-bar"></i> Status
            </Link>
          </li>
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
