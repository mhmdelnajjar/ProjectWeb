'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavBarAdmin() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("sessionId");
    router.push("/");
  };

  return (
    <header className="bg-blue-800 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/cse-logo.png" alt="QU CSE" className="h-10" />
          <h1 className="text-xl font-bold">CSE Admin Dashboard</h1>
        </div>
        <nav className="flex items-center space-x-6">
          <Link href="/admin" className="hover:underline flex items-center gap-1">
            <i className="fas fa-home"></i> Dashboard
          </Link>
          <Link href="/create-course" className="hover:underline flex items-center gap-1">
            <i className="fas fa-plus-circle"></i> Create Course
          </Link>
          <button 
            onClick={handleLogout}
            className="hover:underline flex items-center gap-1"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </div>
    </header>
  );
}