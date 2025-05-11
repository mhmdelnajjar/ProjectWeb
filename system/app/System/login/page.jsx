'use client'
import styles from "@/app/style/page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Login failed");
        return;
      }

      const { userType } = await res.json(); // optional
      if (userType === 'student') router.push('/System/student');
      else if (userType === 'instructor') router.push('/System/instructor');
      else if (userType === 'admin') router.push('/System/admin');

    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.heads}>
          <img 
            src="/media/qu-logo-small.png" 
            alt="QU CSE" 
            className={styles.img} 
          />
          <h1>CSE Registration</h1>
          <h3>Register now for the CSE department at QU and kickstart your tech journey!</h3>
        </div>
      </header>

      <div className={`${styles.login} ${styles.logincontent}`}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Email"
            name="username"
            required
          />
          <br /><br />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
          />
          <br /><br />
          <button type="submit" className={styles.subbtn}>
            Login
          </button>
          {error && (
            <div id="loginError" style={{ color: 'red', marginTop: '10px' }}>
              {error}
            </div>
          )}
        </form>
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2025 CSE Department</p>
      </footer>
    </div>
  );
}
