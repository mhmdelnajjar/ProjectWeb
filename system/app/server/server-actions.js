'use server'
import systemRepo from "../repo/systemRepo";

export async function getCurrent(email) {
  return await systemRepo.getCurrentCourses(email);
}

export async function getCompleted(email) {
  return await systemRepo.getCompletedCourses(email);
}

export async function getPending(email) {
  return await systemRepo.getPendingCourses(email);
}

// Make sure this export exists
export async function getAllCourses() {
  return await systemRepo.getCourses()
}

export async function updatePending(email, courseNum) {
  return await systemRepo.updatePending(email, courseNum);
}

export async function getAssingendCourses(instId) {
  return await systemRepo.getAssigned(instId);
}


  
export async function submitGrade(studentId, courseNumber, grade) {
    return await systemRepo.updateGrade(studentId, courseNumber, grade)
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