'use client'
import React, { useEffect, useState } from 'react';
import NavStudent from '@/app/components/NavStudent';
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrent, getPending, getCompleted } from '@/app/server/server-actions';
import Link from 'next/link';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [curr, setCurr] = useState(null);
  const [comp, setComp] = useState(null);
  const [pend, setPend] = useState(null);
  const [bool, setBool] = useState(false);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // NEW

  // Handle session and fetch data
  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem("sessionId")) {
      router.push("/");
      return;
    }

    const email = sessionStorage.getItem("sessionId")?.split("#")[1];
    if (!email) return;

    const fetchAll = async () => {
      const [currRes, compRes, pendRes] = await Promise.all([
        getCurrent(email),
        getCompleted(email),
        getPending(email)
      ]);

      setCurr(currRes);
      setComp(compRes);
      setPend(pendRes);
    };

    fetchAll();
  }, [router]);

  // Parse courses from URL once
  useEffect(() => {
    const coursesJSON = searchParams.get('courses');
    if (coursesJSON) {
      try {
        setCourses(JSON.parse(coursesJSON));
      } catch (e) {
        console.error("Invalid courses JSON", e);
      }
    }
  }, [searchParams]);

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

  return (
    <>
     <NavStudent />
      <nav className="navcontainer">
        <ul>
          <li><a id="homenav">HOME</a></li>
          <li><a id="regnav" href="">REGISTER</a></li>
          <li className="learning-path-dropdown">
            <div className="menu-head">
              <span>VIEW LEARNING PATH</span>
              <img src="./media/icons/caret-down.svg" alt="" className="dropdown-icon" />
            </div>
            <select onChange={handleDropDown} className="dropdown" id="dropdownR" size="3" aria-label="Learning Path Selection">
              <option value="completed">Courses Completed</option>
              <option value="progress">Courses In Progress</option>
              <option value="pending">Pending Courses</option>
            </select>
          </li>
          <li><Link href="student/aboutus" id="abtus">ABOUT US</Link></li>
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
              ?.filter((course) =>
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
                  {bool ? <button>Register</button> : null}
                </div>
              ))}
          </div>
        </main>
      </div>
    </>
  );
}
