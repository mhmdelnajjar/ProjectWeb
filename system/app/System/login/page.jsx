'use client'
import styles from "@/app/style/page.module.css"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authenticateUser } from '@/app/actions/auth'
import Cookies from 'js-cookie'

export default function Page() {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const username = formData.get('username')
    const password = formData.get('password')

    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      const result = await authenticateUser(username, password)

      if (result.success) {
        // Store in local storage
        localStorage.setItem('user', `${result.user.userType}#${username}#${password}`)

        // Store JWT token
        Cookies.set('token', result.token, { expires: 1 }) // Expires in 1 day

        // Redirect based on user type
        switch (result.user.userType) {
          case 'student':
            router.push('/System/student')
            break
          case 'instructor':
            router.push('/System/instructor')
            break
          case 'admin':
            router.push('/System/admin')
            break
          default:
            setError('Invalid user type')
        }
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('An error occurred during login')
      console.error('Login error:', error)
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
  )
}