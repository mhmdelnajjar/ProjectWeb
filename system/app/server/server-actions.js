'use server'
import systemRepo from "../repo/systemRepo";



export async function getCurrent(email) {
return await systemRepo.getCurrentCourses(email)
}
export async function getCompleted(email) {
    return await systemRepo.getCompletedCourses(email)
    
}
export async function getPending(email) {
    return await systemRepo.getPendingCourses(email)
}
export async function getAllCourses() {

return await systemRepo.getCourses()
    
}
export async function updatePending(email,courseNum) {
return await systemRepo.updatePending(email,courseNum)
}