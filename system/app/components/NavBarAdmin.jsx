'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavBarAdmin() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("sessionId");
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
          <Link href="/System/admin" className="nav-btn">
            <i className="fas fa-home"></i> Dashboard
          </Link>
          <Link href="/System/create-course" className="nav-btn">
            <i className="fas fa-plus-circle"></i> Create Course
          </Link>
          <Link href="/System/status" className="nav-btn">
            <i className="fas fa-chart-bar"></i> Show Statistics
          </Link>
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
