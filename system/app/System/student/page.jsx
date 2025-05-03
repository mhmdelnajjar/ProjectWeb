'use client'
import React, { useEffect, useState } from 'react';
import NavStudent from '@/app/components/NavStudent';
import { useRouter } from "next/navigation";
import { getCurrent, getPending, getCompleted, getAllCourses } from '@/app/server/server-actions';
import Link from 'next/link';

export default function Page() {
  const router = useRouter();
  const [curr, setCurr] = useState([]);
  const [comp, setComp] = useState([]);
  const [pend, setPend] = useState([]);
  const [bool, setBool] = useState(false);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  async function coursesGetter() {
    try {
      const cc = await getAllCourses();
      setCourses(cc || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  }

  // Handle session and fetch data
  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem("sessionId")) {
      router.push("/");
      return;
    }

    const email = sessionStorage.getItem("sessionId")?.split("#")[1];
    if (!email) return;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const [currRes, compRes, pendRes] = await Promise.all([
          getCurrent(email),
          getCompleted(email),
          getPending(email)
        ]);

        setCurr(currRes || []);
        setComp(compRes || []);
        setPend(pendRes || []);
        await coursesGetter();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [router]);

  function handleDropDown(e) {
    const choice = e.target.value;
    if (choice === "completed") {
      setCourses(comp || []);
    } else if (choice === "pending") {
      setCourses(pend || []);
    } else {
      setCourses(curr || []);
    }
  }


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavStudent />
      <nav className="navcontainer">
        <ul>
          <li><Link href="/System/student" onClick={()=> {
            setBool(false)
          }}>HOME</Link></li>
          <li>
            <Link 
              href="/System/student" 
              onClick={()=> {
                setBool(true)
              }}
            >
              REGISTER
            </Link>
          </li>
          <li className="learning-path-dropdown">
            <div className="menu-head">
              <span>VIEW LEARNING PATH</span>
              <img src="./media/icons/caret-down.svg" alt="" className="dropdown-icon" />
            </div>
            <select onChange={handleDropDown} className="dropdown" id="dropdownR" size="3" aria-label="Learning Path Selection">
              <option value="progress">Courses In Progress</option>
              <option value="completed">Courses Completed</option>
              <option value="pending">Pending Courses</option>
            </select>
          </li>
          <li><Link href="student/aboutus">ABOUT US</Link></li>
        </ul>
      </nav>

      <div className="container">
        <main className="main">
          <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="searchBar" className="searchLabel">Search for courses: </label>
            <input
              id="searchBar"
              type="text"
              placeholder="Search..."
              className="search-box"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
            />
            <button type="submit" className="search-btn">
              <img src="/media/icons/search.svg" alt="search" className="searchIcon" />
            </button>
          </form>

          <h2 className="sectionTitle">Courses Available</h2>

          <div className="cards">
            {courses
              .filter((course) =>
                course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((course, index) => (
                <div className="card1" key={index}>
                  <img
                    className="img1"
                    src={course.image || "https://media.istockphoto.com/id/147480805/photo/oop-object-oriented-programming.jpg"}
                    alt={course.course_name}
                  />
                  <div className="cardContent">
                    <h3 className="cardTitle">{course.course_number}</h3>
                    <h4 className="cardSubtitle">{course.course_name}</h4>
                    <p className="cardText">
                      {course.category} course taught by {course.course_instructor}
                    </p>
                    <div className="cardFooter">
                      <p className="cardMeta">
                        {course.registeredStudents}/{course.capacity} students
                      </p>
                      <span className="cardDate">
                        {course.prerequisite ? `Prerequisite: ${course.prerequisite.split(":")[0]}` : 'No prerequisites'}
                      </span>
                    </div>
                  </div>
                  <br />
                  {bool && (
                    <button 
                
                      className="btn-register"
                      onClick={() => {
                      }}
                    >
                      Register
                    </button>
                  )}
                </div>
              ))}
          </div>
        </main>
      </div>
    </>
  );
}