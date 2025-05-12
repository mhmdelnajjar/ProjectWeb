'use client'
import styles from "@/app/style/page.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page({ initailUsers}) {
  const router = useRouter();
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.target);
    const { username, password } = Object.fromEntries(formData);

    // Validate inputs
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    // Check if initialUsers is available

    // Find matching user
   const user = initailUsers.find(u => {
 // Log the username
  return u.username === username && u.password === password;
});


    if (!user) {
      setError("Invalid username or password");
      return;
    }
      sessionStorage.setItem('sessionId', `${user.userType}#${username}#${password}`);


    // Redirect based on userType
    switch(user.userType) {
      case 'student':
        router.push('/System/student');
        break;
      case 'instructor':
        router.push('/System/instructor');
        break;
      case 'admin':
        router.push('/System/admin');
        break;
      default:
        setError("Unknown user type");
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
            placeholder="Username (QU email)"
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
            <div className={styles.error}>
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