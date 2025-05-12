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
        <div className="navbar-brand">
          <img src="/media/cse-logo.png" alt="QU CSE" className="navbar-logo" />
          <h1 className="navbar-title">CSE Admin Dashboard</h1>
        </div>
        <nav className="navbar-nav">
          <Link href="/System/admin" className="navbar-link">
            <i className="fas fa-home"></i> Dashboard
          </Link>
          <Link href="/System/create-course" className="navbar-link">
            <i className="fas fa-plus-circle"></i> Create Course
          </Link>
          <Link href="/System/status" className="navbar-link">
            <i className="fas fa-chart-bar"></i> Show Statistics
          </Link>
          <button 
            onClick={handleLogout}
            className="logout-button" 
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
