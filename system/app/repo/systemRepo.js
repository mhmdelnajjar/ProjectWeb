
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class SystemRepo {
  // Get all courses
  async getCourses() {
    return await prisma.course.findMany();
  }

  async getUsers() {
    return await prisma.user.findMany();
  }

  async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { username: email }
    });
  }

  async getCurrentCourses(email) {
    const user = await prisma.user.findUnique({
      where: { username: email },
      include: {
        currentCourses: { include: { course: true } }
      }
    });
    return user?.currentCourses.map(record => record.course) || [];
  }

  async getPendingCourses(email) {
    const user = await prisma.user.findUnique({
      where: { username: email },
      include: {
        pendingCourses: { include: { course: true } }
      }
    });
    return user?.pendingCourses.map(record => record.course) || [];
  }

  async getCompletedCourses(email) {
    const user = await prisma.user.findUnique({
      where: { username: email },
      include: {
        completedCourses: { include: { course: true } }
      }
    });
    return user?.completedCourses.map(record => record.course) || [];
  }

  async updatePending(email, courseNumber) {
    try {
      const user = await prisma.user.findUnique({ where: { username: email } });
      const course = await prisma.course.findUnique({ where: { course_number: courseNumber } });
      const already = await prisma.courseRecord.findFirst({
        where: {
          courseId: course.course_number,
          pendingById: user.id
        }
      });
      if (already) return true;
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
    const assignments = await prisma.courseAssignment.findMany({
      where: { instructor: { username: instId } },
      include: { course: true }
    });

    const coursesWithStudents = await Promise.all(
      assignments.map(async (assignment) => {
        const studentRecords = await prisma.courseRecord.findMany({
          where: {
            courseId: assignment.courseId,
            currentById: { not: null }
          },
          include: { currentBy: true }
        });

        return {
          ...assignment.course,
          students: studentRecords.map(record => ({
            id: record.currentBy.id,
            username: record.currentBy.username,
            name: record.currentBy.name || record.currentBy.username,
            grade: record.grade || 'N/A'
          }))
        };
      })
    );

    return coursesWithStudents;
  }

  async updateGrade(studentId, courseNumber, grade) {
    try {
      await prisma.courseRecord.updateMany({
        where: {
          currentById: parseInt(studentId),
          courseId: courseNumber
        },
        data: { grade }
      });
      return true;
    } catch (error) {
      console.error("❌ updateGrade error:", error);
      throw error;
    }
  }

  async getPendingRequests() {
    return await prisma.courseRecord.findMany({
      where: {
        pendingById: { not: null }
      },
      include: {
        course: true,
        pendingBy: true
      }
    });
  }

  async handleCourseRequest(studentId, courseNumber, isApproved) {
    await prisma.courseRecord.deleteMany({
      where: {
        pendingById: parseInt(studentId),
        courseId: courseNumber
      }
    });

    if (isApproved) {
      await prisma.courseRecord.create({
        data: {
          courseId: courseNumber,
          currentById: parseInt(studentId)
        }
      });

      await prisma.course.update({
        where: { course_number: courseNumber },
        data: { registeredStudents: { increment: 1 } }
      });
    }

    return true;
  }

  async toggleCourseApproval(courseNumber, isOpen) {
    return await prisma.course.update({
      where: { course_number: courseNumber },
      data: { isOpen }
    });
  }

  async deleteCourse(courseNumber) {
    return await prisma.course.delete({
      where: { course_number: courseNumber }
    });
  }

  async bulkUpdateCourses(isOpen) {
    return await prisma.course.updateMany({ data: { isOpen } });
  }

  async bulkHandleRequests(isApproved) {
    if (isApproved) {
      const pendingRecords = await prisma.courseRecord.findMany({
        where: { pendingById: { not: null } }
      });

      await prisma.$transaction([
        prisma.courseRecord.deleteMany({ where: { pendingById: { not: null } } }),
        ...pendingRecords.map(record =>
          prisma.courseRecord.create({
            data: {
              courseId: record.courseId,
              currentById: record.pendingById
            }
          })
        ),
        prisma.course.updateMany({
          where: {
            course_number: { in: pendingRecords.map(r => r.courseId) }
          },
          data: { registeredStudents: { increment: 1 } }
        })
      ]);
    } else {
      await prisma.courseRecord.deleteMany({
        where: { pendingById: { not: null } }
      });
    }

    return true;
  }

  // 10 STATISTICS METHODS HERE

async getTotalStudentsPerCourse() {
  const records = await prisma.courseRecord.findMany({
    where: {
      OR: [
        { currentById: { not: null } },
        { completedById: { not: null } }
      ]
    },
    include: { course: true }
  });

  const map = {};
  for (const rec of records) {
    const course = rec.course;
    if (!map[course.course_number]) {
      map[course.course_number] = {
        course_name: course.course_name,
        total_students: 0
      };
    }
    map[course.course_number].total_students += 1;
  }

  return Object.entries(map).map(([course_number, data]) => ({
    course_number,
    ...data
  }));
}


async getTotalStudentsPerCategory() {
  const records = await prisma.courseRecord.findMany({
    where: {
      OR: [
        { currentById: { not: null } },
        { completedById: { not: null } }
      ]
    },
    include: { course: true }
  });

  const map = {};
  for (const rec of records) {
    const category = rec.course.category;
    if (!map[category]) map[category] = 0;
    map[category] += 1;
  }
  return map;
}


async getPassedStudentsPerCourse() {
  const records = await prisma.courseRecord.findMany({
    where: {
      grade: { in: ["A", "B", "C"] }
    },
    include: { course: true }
  });

  const map = {};
  for (const rec of records) {
    const c = rec.course;
    if (!map[c.course_number]) {
      map[c.course_number] = { course_name: c.course_name, count: 0 };
    }
    map[c.course_number].count++;
  }
  return map;
}


async getFailureRatePerCourse() {
  const records = await prisma.courseRecord.findMany({
    where: { grade: { not: null } },
    include: { course: true }
  });

  const stats = {};
  for (const rec of records) {
    const course = rec.course;
    const cid = course.course_number;
    if (!stats[cid]) {
      stats[cid] = { course_name: course.course_name, total: 0, fail: 0 };
    }
    stats[cid].total++;
    if (rec.grade === "F") stats[cid].fail++;
  }

  return Object.entries(stats).map(([course_number, d]) => ({
    course_number,
    course_name: d.course_name,
    failure_rate: (d.fail / d.total) * 100
  }));
}


async getTop3CoursesByEnrollment() {
  const records = await prisma.courseRecord.findMany({
    where: {
      OR: [
        { currentById: { not: null } },
        { completedById: { not: null } }
      ]
    },
    include: { course: true }
  });

  const map = {};
  for (const rec of records) {
    const c = rec.course;
    if (!map[c.course_number]) {
      map[c.course_number] = { course_name: c.course_name, count: 0 };
    }
    map[c.course_number].count++;
  }

  return Object.entries(map)
    .map(([course_number, data]) => ({ course_number, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}


async getAverageGradePerCourse() {
  const gradeMap = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  const records = await prisma.courseRecord.findMany({
    where: { grade: { not: null } },
    include: { course: true }
  });

  const stats = {};
  for (const rec of records) {
    const course = rec.course;
    const g = gradeMap[rec.grade];
    const cid = course.course_number;
    if (!stats[cid]) {
      stats[cid] = { course_name: course.course_name, sum: 0, count: 0 };
    }
    stats[cid].sum += g;
    stats[cid].count++;
  }

  return Object.entries(stats).map(([course_number, d]) => ({
    course_number,
    course_name: d.course_name,
    avg_grade: (d.sum / d.count).toFixed(2)
  }));
}


async getOpenVsClosedCoursesCount() {
  const [open, closed] = await Promise.all([
    prisma.course.count({ where: { isOpen: true } }),
    prisma.course.count({ where: { isOpen: false } })
  ]);
  return { open, closed };
}


async getPendingEnrollmentsPerCourse() {
  const records = await prisma.courseRecord.findMany({
    where: { pendingById: { not: null } },
    include: { course: true }
  });

  const map = {};
  for (const rec of records) {
    const course = rec.course;
    if (!map[course.course_number]) {
      map[course.course_number] = {
        course_name: course.course_name,
        count: 0
      };
    }
    map[course.course_number].count++;
  }

  return map;
}


async getMostFailedCourse() {
  const records = await prisma.courseRecord.findMany({
    where: { grade: "F" },
    include: { course: true }
  });

  const map = {};
  for (const rec of records) {
    const course = rec.course;
    if (!map[course.course_number]) {
      map[course.course_number] = {
        course_name: course.course_name,
        count: 0
      };
    }
    map[course.course_number].count++;
  }

  const sorted = Object.entries(map).sort(([, a], [, b]) => b.count - a.count);
  const [cid, data] = sorted[0] || [null, null];
  return { course_number: cid, ...data };
}


async getStudentCountPerInstructor() {
  const records = await prisma.courseRecord.findMany({
    where: {
      OR: [
        { currentById: { not: null } },
        { completedById: { not: null } }
      ]
    },
    include: { course: true }
  });

  const map = {};
  for (const rec of records) {
    const instructor = rec.course.course_instructor;
    if (!map[instructor]) map[instructor] = 0;
    map[instructor]++;
  }
  return map;
}

}

export default new SystemRepo();