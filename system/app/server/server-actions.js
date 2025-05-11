'use server'
import systemRepo from "../repo/systemRepo";
import { verifyJwt } from '@/app/lib/jwt';
import { cookies } from 'next/headers';
// Base methods

export async function getUsers() {
  const token = cookies().get('id_token')?.value;
  const user = verifyJwt(token);

  if (!user || user.userType !== 'admin') {
    throw new Error('Unauthorized');
  }

  return await systemRepo.getUsers()
}
export async function getCurrent(email) {
  return await systemRepo.getCurrentCourses(email);
}

export async function getCompleted(email) {
  return await systemRepo.getCompletedCourses(email);
}

export async function getPending(email) {
  return await systemRepo.getPendingCourses(email);
}

export async function getAllCourses() {
  return await systemRepo.getCourses();
}

export async function updatePending(email, courseNum) {
  return await systemRepo.updatePending(email, courseNum);
}

export async function getAssingendCourses(instId) {
  return await systemRepo.getAssigned(instId);
}

export async function submitGrade(studentId, courseNumber, grade) {
  return await systemRepo.updateGrade(studentId, courseNumber, grade);
}

export async function getCourses() {
  return await systemRepo.getCourses();
}

export async function getPendingRequests() {
  return await systemRepo.getPendingRequests();
}

export async function handleRequest(studentId, courseNumber, isApproved) {
  return await systemRepo.handleCourseRequest(studentId, courseNumber, isApproved);
}

export async function toggleCourseApproval(courseNumber, isOpen) {
  return await systemRepo.toggleCourseApproval(courseNumber, isOpen);
}

export async function deleteCourse(courseNumber) {
  return await systemRepo.deleteCourse(courseNumber);
}

export async function bulkUpdateCourses(isOpen) {
  return await systemRepo.bulkUpdateCourses(isOpen);
}

export async function bulkHandleRequests(isApproved) {
  return await systemRepo.bulkHandleRequests(isApproved);
}

// STATISTICS METHODS
export async function getTotalStudentsPerCourse() {
  return await systemRepo.getTotalStudentsPerCourse();
}

export async function getTotalStudentsPerCategory() {
  return await systemRepo.getTotalStudentsPerCategory();
}

export async function getPassedStudentsPerCourse() {
  return await systemRepo.getPassedStudentsPerCourse();
}

export async function getFailureRatePerCourse() {
  return await systemRepo.getFailureRatePerCourse();
}

export async function getTop3CoursesByEnrollment() {
  return await systemRepo.getTop3CoursesByEnrollment();
}

export async function getAverageGradePerCourse() {
  return await systemRepo.getAverageGradePerCourse();
}

export async function getOpenVsClosedCoursesCount() {
  return await systemRepo.getOpenVsClosedCoursesCount();
}

export async function getPendingEnrollmentsPerCourse() {
  return await systemRepo.getPendingEnrollmentsPerCourse();
}

export async function getMostFailedCourse() {
  return await systemRepo.getMostFailedCourse();
}

export async function getStudentCountPerInstructor() {
  return await systemRepo.getStudentCountPerInstructor();
}
