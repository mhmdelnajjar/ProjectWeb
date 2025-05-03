'use client'
import React, { useEffect, useState } from 'react';
import NavStudent from '@/app/components/NavStudent';
import { useRouter } from "next/navigation";
import { getCurrent, getPending, getCompleted, getAllCourses,updatePending } from '@/app/server/server-actions';
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
    setBool(false);
    if (choice === "completed") {
      setCourses(comp || []);
    } else if (choice === "pending") {
      setCourses(pend || []);
    } else {
      setCourses(curr || []);
    }
  }
  async function handleRegister(course) {
    const email = sessionStorage.getItem("sessionId")?.split("#")[1];
    if (!email) return;

    try {
        // Check if already pending
        if (pend.some(c => c.course_number === course.course_number)) {
            alert("Registration already pending");
            return;
        }

        // Add to pending
        await updatePending(email, course.course_number);
        
        // Update local state
        setPend([...pend, { course_number: course.course_number }]);
        alert("Registration request submitted");
    } catch (error) {
        console.error("Registration failed:", error);
        alert("Registration failed. Please try again.");
    }
}
  function checkPreRequisite(courseNum, coursePrerequisite) {
    const passingGrades = ["A", "B", "C", "D"];

    // 1. Check if already registered in current courses
    if (curr.some(c => c.course_number === courseNum)) {
        return { status: false, text: "Already Registered" };
    }

    // 2. Check if pending approval
    if (pend.some(c => c.course_number === courseNum)) {
        return { status: false, text: "Pending Approval" };
    }

    // 3. Check if completed with passing grade
    const completedCourse = comp.find(c => c.course_number === courseNum);
    if (completedCourse) {
        const grade = completedCourse.grade?.trim().toUpperCase();
        if (grade && passingGrades.includes(grade)) {
            return { status: false, text: "Already Completed" };
        }
    }

    // 4. Check prerequisites
    if (coursePrerequisite) {
        const [prereqNum, minGrade] = coursePrerequisite.includes(":") 
            ? coursePrerequisite.split(":") 
            : [coursePrerequisite, "D"]; // Default to D if no grade specified

        const prereqCourse = comp.find(c => c.course_number === prereqNum);
        
        if (!prereqCourse) {
            return { status: false, text: `Missing: ${prereqNum}` };
        }

        const prereqGrade = prereqCourse.grade?.trim().toUpperCase();
        if (!prereqGrade) {
            return { status: false, text: `${prereqNum} Not Graded` };
        }

        // Grade comparison
        const gradeOrder = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
        const requiredGrade = minGrade?.trim().toUpperCase() || 'D';
        
        if (!(prereqGrade in gradeOrder) || !(requiredGrade in gradeOrder)) {
            return { status: false, text: "Invalid Grade" };
        }

        if (gradeOrder[prereqGrade] < gradeOrder[requiredGrade]) {
            return { status: false, text: `${prereqNum} Grade Too Low` };
        }
    }

    // 5. Check course capacity
    const targetCourse = courses.find(c => c.course_number === courseNum);
    if (targetCourse && targetCourse.registeredStudents >= targetCourse.capacity) {
        return { status: false, text: "Course Full" };
    }

    return { status: true, text: "Register" };
}
if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavStudent />
      <nav className="navcontainer">
        <ul>
          <li>
            <Link href="/System/student" onClick={() => {setBool(false)
              coursesGetter()
            }}>
              HOME
            </Link>
          </li>
          <li>
            <Link 
              href="/System/student" 
              onClick={() => {setBool(true)
                coursesGetter()
              
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
              .map((course, index) => {
                const result = checkPreRequisite(course.course_number, course.prerequisite);
                return (
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
                          {course.prerequisite ? `Prerequisite: ${course.prerequisite.split(":")[1]}` :""}
                        </span>
                      </div>
                    </div>
                    <br />
                    {bool && (
    result.status ? (
        <button 
            className="btn-register"
            onClick={() => handleRegister(course)}
        >
            Register
        </button>
    ) : (
        <span className="registration-status">
            {result.text}
        </span>
    )
)}
                  </div>
                );
              })}
          </div>
        </main>
      </div>
    </>
  );
}