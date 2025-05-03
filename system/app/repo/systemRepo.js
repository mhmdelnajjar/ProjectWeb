
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
class SystemRepo{
async getUsers() {
  return await prisma.user.findMany()
}
async getCourses() {
 return  await prisma.course.findMany()
}


async  getCurrentCourses(email) {
  const user = await prisma.user.findUnique({
    where: { username: email },
    include: {
      currentCourses: {
        include: {
          course: true
        }
      }
    }
  });

  return user?.currentCourses.map(record => record.course) || [];
}

async getCompletedCourses(email) {
  const user = await prisma.user.findUnique({
    where: { username: email },
    include: {
      completedCourses: {
        include: {
          course: true
        }
      }
    }
  });

  return user?.completedCourses.map(record => record.course) || [];
}
async getPendingCourses(email) {
  const user = await prisma.user.findUnique({
    where: { username: email },
    include: {
      pendingCourses: {
        include: {
          course: true
        }
      }
    }
  });

  return user?.pendingCourses.map(record => record.course) || [];
}
async updatePending(email, courseNumber) {

  try {

    const user = await prisma.user.findUnique({

      where: { username: email },

    });
 
    if (!user) throw new Error("User not found: " + email);
 
    const course = await prisma.course.findUnique({

      where: { course_number: courseNumber }

    });
 
    if (!course) throw new Error("Course not found: " + courseNumber);
 
    const already = await prisma.courseRecord.findFirst({

      where: {

        courseId: course.course_number,

        pendingById: user.id

      }

    });
 
    if (already) return true; // already pending
 
    await prisma.courseRecord.create({

      data: {

        courseId: course.course_number,

        pendingById: user.id

      }

    });
 
    return true;

  } catch (error) {

    console.error("❌ updatePending error:", error);

    throw error;

  }

}

 
async getAssigned(instId) {
  const user = await prisma.user.findUnique({
    where: { username: instId },
    include: {
      assignedCourses: {
        include: {
          course: true
        }
      }
    }
  });

  return user?.currentCourses.map(record => record.course) || [];
}
}


export default new SystemRepo()