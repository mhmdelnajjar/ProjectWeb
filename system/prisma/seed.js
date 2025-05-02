import { PrismaClient } from '@prisma/client';
import fs from 'fs-extra';
import path from 'path';

const prisma = new PrismaClient();

async function seed() {
  // Load JSON files
  const usersPath = path.join(process.cwd(), 'app/data/users.json');
  const coursesPath = path.join(process.cwd(), 'app/data/courses.json');
  
  const usersData = await fs.readJSON(usersPath);
  const coursesData = await fs.readJSON(coursesPath);

  // Seed courses
  if (Array.isArray(coursesData.courses)) {
    for (const course of coursesData.courses) {
      await prisma.course.upsert({
        where: { course_number: course.course_number },
        update: {},
        create: {
          course_number: course.course_number,
          course_name: course.course_name,
          course_instructor: course.course_instructor,
          capacity: course.capacity,
          registeredStudents: course.registeredStudents,
          isOpen: course.isOpen,
          category: course.category,
          prerequisite: course.prerequisite,
          image: course.image,
        }
      });
    }
  } else {
    console.error("Courses data is not an array", coursesData);
  }

  // Seed users
  if (Array.isArray(usersData.usersArray)) {
    for (const user of usersData.usersArray) {
      const createdUser = await prisma.user.create({
        data: {
          username: user.username,
          password: user.password,
          userType: user.userType
        }
      });

      // If student, handle course records
      if (user.userType === 'student') {
        if (Array.isArray(user.completedCourses)) {
          for (const course of user.completedCourses) {
            await prisma.courseRecord.create({
              data: {
                courseId: course.course_number,
                grade: course.grade,
                completedById: createdUser.id
              }
            });
          }
        }

        if (Array.isArray(user.currentCourses)) {
          for (const course of user.currentCourses) {
            await prisma.courseRecord.create({
              data: {
                courseId: course.course_number,
                currentById: createdUser.id
              }
            });
          }
        }

        if (Array.isArray(user.pendingCourses)) {
          for (const course of user.pendingCourses) {
            await prisma.courseRecord.create({
              data: {
                courseId: course.course_number,
                pendingById: createdUser.id
              }
            });
          }
        }
      }

      // If instructor, handle course assignments
      if (user.userType === 'instructor') {
        if (Array.isArray(user.assignedCourses)) {
          for (const assignment of user.assignedCourses) {
            await prisma.courseAssignment.create({
              data: {
                courseId: assignment.course_number,
                instructorId: createdUser.id
              }
            });
          }
        }
      }

      // Skip course record handling for admin users
      if (user.userType === 'admin') {
        continue;
      }
    }
  } else {
    console.error("Users data is not an array", usersData);
  }

  console.log('✅ Database seeded successfully!');
}

try {
  console.log("Seeding database...");
  await seed();
} catch (error) {
  console.error("Error seeding:", error);
} finally {
  await prisma.$disconnect();
}
