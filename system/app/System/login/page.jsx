'use client'
import styles from "@/app/style/page.module.css";

import {useRouter} from "next/navigation";

export default function page({initailUsers}) {
  const router = useRouter()
  async function handleSubmit(e) {
   
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const username = data.username

    
    const password = data.password


  
  const user =  initailUsers.find(a=>a.username==username)
if (user) {
if (user.password == password){

sessionStorage.setItem('sessionId',`${user.userType}#${username}#${password}`)


switch (user.userType) {
  case "student":
    // 
    router.push(`/System/student`)
    break;
  case "instructor":
    router.push("/System/instructor"); // Fixed case sensitivity
    break;
  case "admin":
    router.push("/System/admin");
    break;
  default:
    console.error("Unknown user type");
}

} else {
  document.querySelector("#loginError").innerHTML= "password is incorrect"

}

  

  }  else {
    document.querySelector("#loginError").innerHTML= "account not found"
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
            id="username"
            name="username"
            required
          />
          <br /><br />
          <input
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            required
          />
          <br /><br />
          <button type="submit" className={styles.subbtn}>
            Login
          </button>
          <div id="loginError">

          </div>
        </form>
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2025 CSE Department</p>
      </footer>
    </div>
  );
}