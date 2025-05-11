'use client';
import React, { useState, useEffect } from 'react';
import '@/app/globals.css';
import NavBar from '@/app/components/NavBarAdmin';
import {
  getTotalStudentsPerCourse,
  getTotalStudentsPerCategory,
  getPassedStudentsPerCourse,
  getFailureRatePerCourse,
  getTop3CoursesByEnrollment,
  getAverageGradePerCourse,
  getOpenVsClosedCoursesCount,
  getPendingEnrollmentsPerCourse,
  getMostFailedCourse,
  getStudentCountPerInstructor
} from '@/app/server/server-actions';

export default function StatisticsPage() {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState(Array(10).fill(null));

  const fetchStats = async () => {
    const results = await Promise.all([
      getTotalStudentsPerCourse(),
      getTotalStudentsPerCategory(),
      getPassedStudentsPerCourse(),
      getFailureRatePerCourse(),
      getTop3CoursesByEnrollment(),
      getAverageGradePerCourse(),
      getOpenVsClosedCoursesCount(),
      getPendingEnrollmentsPerCourse(),
      getMostFailedCourse(),
      getStudentCountPerInstructor()
    ]);
    setData(results);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statTitles = [
    "1. Total Students Per Course",
    "2. Total Students Per Category",
    "3. Passed Students Per Course",
    "4. Failure Rate Per Course",
    "5. Top 3 Courses by Enrollment",
    "6. Average Grade Per Course",
    "7. Open vs Closed Courses",
    "8. Pending Enrollments Per Course",
    "9. Most Failed Course",
    "10. Student Count Per Instructor"
  ];

  const renderStat = () => {
    const stat = data[index];
    if (!stat) return <p>Loading...</p>;

    switch (index) {
      case 0: return <ul>{stat.map(c => <li key={c.course_number}>{c.course_name}: {c.total_students}</li>)}</ul>;
      case 1: return <ul>{Object.entries(stat).map(([cat, count]) => <li key={cat}>{cat}: {count}</li>)}</ul>;
      case 2: return <ul>{Object.entries(stat).map(([k, v]) => <li key={k}>{v.course_name}: {v.count}</li>)}</ul>;
      case 3: return <ul>{stat.map(s => <li key={s.course_number}>{s.course_name}: {s.failure_rate.toFixed(2)}%</li>)}</ul>;
      case 4: return <ul>{stat.map(s => <li key={s.course_number}>{s.course_name}: {s.count}</li>)}</ul>;
      case 5: return <ul>{stat.map(s => <li key={s.course_number}>{s.course_name}: {s.avg_grade}</li>)}</ul>;
      case 6: return <p>🟢 Open: {stat.open} | 🔴 Closed: {stat.closed}</p>;
      case 7: return <ul>{Object.entries(stat).map(([k, v]) => <li key={k}>{v.course_name}: {v.count}</li>)}</ul>;
      case 8: return <p>{stat.course_name} ({stat.course_number}): {stat.count} F grades</p>;
      case 9: return <ul>{Object.entries(stat).map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul>;
      default: return null;
    }
  };

  return (
    <>
    <NavBar/>
    <div className="stats-container">
      <h1>📊 Statistics Dashboard</h1>
      <div className="stats-section">
        <h2>{statTitles[index]}</h2>
        {renderStat()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button className="return-button" onClick={() => setIndex(index - 1)} disabled={index === 0}>Previous</button>
        <button className="return-button" onClick={() => setIndex(index + 1)} disabled={index === 9}>Next</button>
      </div>
    </div>
    </>
  )
}
