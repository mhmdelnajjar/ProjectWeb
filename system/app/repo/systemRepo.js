
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
    // 1. Find the user
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

    if (!user) {
      throw new Error("User not found");
    }

    // 2. Check if course is already pending
    const alreadyPending = user.pendingCourses.some(
      pc => pc.course.course_number === courseNumber
    );
    
    if (alreadyPending) {
      return true; // Already pending
    }

    // 3. Find the course
    const course = await prisma.course.findUnique({
      where: { course_number: courseNumber }
    });

    if (!course) {
      throw new Error("Course not found");
    }

    // 4. Create pending course record
    await prisma.pendingCourse.create({
      data: {
        userId: user.id,
        courseId: course.course_number,
        status: 'PENDING'
      }
    });

    return true;
  } catch (error) {
    console.error("Error in updatePending:", error);
    throw error;
  }
}
}


export default new SystemRepo()