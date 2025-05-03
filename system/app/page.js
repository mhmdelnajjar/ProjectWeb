import Image from "next/image";
import styles from "./page.module.css";
import Login from "./System/login/page";
import SystemRepo from "./repo/systemRepo";
export default async function Home() {
  
  const users  = await SystemRepo.getUsers()


  
  return (
   <>
   <Login  initailUsers={users} />
   </>
  )
}
