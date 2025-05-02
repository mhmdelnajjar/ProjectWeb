
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
}


export default new SystemRepo()