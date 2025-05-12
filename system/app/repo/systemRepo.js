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
    const records = await prisma.courseRecord.groupBy({
      by: ['courseId'],
      where: {
        OR: [
          { currentById: { not: null } },
          { completedById: { not: null } }
        ]
      },
      _count: {
        courseId: true
      }
    });

    const courses = await prisma.course.findMany({
      where: {
        course_number: {
          in: records.map(r => r.courseId)
        }
      }
    });

    return records.map(record => {
      const course = courses.find(c => c.course_number === record.courseId);
      return {
        course_number: record.courseId,
        course_name: course.course_name,
        total_students: record._count.courseId
      };
    });
  }

  async getTotalStudentsPerCategory() {
    const records = await prisma.courseRecord.findMany({
      where: {
        OR: [
          { currentById: { not: null } },
          { completedById: { not: null } }
        ]
      },
      include: {
        course: {
          select: {
            category: true
          }
        }
      }
    });

    const categoryCounts = records.reduce((acc, record) => {
      const category = record.course.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return categoryCounts;
  }

  async getPassedStudentsPerCourse() {
    const records = await prisma.courseRecord.groupBy({
      by: ['courseId'],
      where: {
        grade: { in: ["A", "B", "C"] }
      },
      _count: {
        courseId: true
      }
    });

    const courses = await prisma.course.findMany({
      where: {
        course_number: {
          in: records.map(r => r.courseId)
        }
      }
    });

    return records.reduce((acc, record) => {
      const course = courses.find(c => c.course_number === record.courseId);
      acc[record.courseId] = {
        course_name: course.course_name,
        count: record._count.courseId
      };
      return acc;
    }, {});
  }

  async getFailureRatePerCourse() {
    const records = await prisma.courseRecord.findMany({
      where: {
        grade: { not: null }
      },
      include: {
        course: true
      }
    });

    const stats = {};
    for (const record of records) {
      const courseId = record.courseId;
      if (!stats[courseId]) {
        stats[courseId] = {
          course_name: record.course.course_name,
          total: 0,
          fail: 0
        };
      }
      stats[courseId].total++;
      if (record.grade === "F") stats[courseId].fail++;
    }

    return Object.entries(stats).map(([courseId, data]) => ({
      course_number: courseId,
      course_name: data.course_name,
      failure_rate: (data.fail / data.total) * 100
    }));
  }

  async getTop3CoursesByEnrollment() {
    const records = await prisma.courseRecord.groupBy({
      by: ['courseId'],
      where: {
        OR: [
          { currentById: { not: null } },
          { completedById: { not: null } }
        ]
      },
      _count: {
        courseId: true
      },
      orderBy: {
        _count: {
          courseId: 'desc'
        }
      },
      take: 3
    });

    const courses = await prisma.course.findMany({
      where: {
        course_number: {
          in: records.map(r => r.courseId)
        }
      }
    });

    return records.map(record => {
      const course = courses.find(c => c.course_number === record.courseId);
      return {
        course_number: record.courseId,
        course_name: course.course_name,
        count: record._count.courseId
      };
    });
  }

  async getAverageGradePerCourse() {
    const records = await prisma.courseRecord.findMany({
      where: {
        grade: { not: null }
      },
      include: {
        course: true
      }
    });

    const gradeMap = { A: 4, B: 3, C: 2, D: 1, F: 0 };
    const stats = {};

    for (const record of records) {
      const courseId = record.courseId;
      if (!stats[courseId]) {
        stats[courseId] = {
          course_name: record.course.course_name,
          sum: 0,
          count: 0
        };
      }
      stats[courseId].sum += gradeMap[record.grade];
      stats[courseId].count++;
    }

    return Object.entries(stats).map(([courseId, data]) => ({
      course_number: courseId,
      course_name: data.course_name,
      avg_grade: (data.sum / data.count).toFixed(2)
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
    const records = await prisma.courseRecord.groupBy({
      by: ['courseId'],
      where: {
        pendingById: { not: null }
      },
      _count: {
        courseId: true
      }
    });

    const courses = await prisma.course.findMany({
      where: {
        course_number: {
          in: records.map(r => r.courseId)
        }
      }
    });

    return records.reduce((acc, record) => {
      const course = courses.find(c => c.course_number === record.courseId);
      acc[record.courseId] = {
        course_name: course.course_name,
        count: record._count.courseId
      };
      return acc;
    }, {});
  }

  async getMostFailedCourse() {
    const records = await prisma.courseRecord.findMany({
      where: {
        grade: "F"
      },
      include: {
        course: true
      }
    });

    const failCounts = {};
    for (const record of records) {
      const courseId = record.courseId;
      if (!failCounts[courseId]) {
        failCounts[courseId] = {
          course_name: record.course.course_name,
          count: 0
        };
      }
      failCounts[courseId].count++;
    }

    const sorted = Object.entries(failCounts)
      .sort(([, a], [, b]) => b.count - a.count);
    
    if (sorted.length === 0) {
      return { course_number: null, course_name: null, count: 0 };
    }

    const [courseId, data] = sorted[0];
    return {
      course_number: courseId,
      course_name: data.course_name,
      count: data.count
    };
  }

  async getStudentCountPerInstructor() {
    const records = await prisma.courseRecord.findMany({
      where: {
        OR: [
          { currentById: { not: null } },
          { completedById: { not: null } }
        ]
      },
      include: {
        course: {
          select: {
            course_instructor: true
          }
        }
      }
    });

    const instructorCounts = {};
    for (const record of records) {
      const instructor = record.course.course_instructor;
      instructorCounts[instructor] = (instructorCounts[instructor] || 0) + 1;
    }

    return instructorCounts;
  }
    async createCourse(courseData) {
    try {
      const course = await prisma.course.create({
        data: {
          course_number: courseData.course_number,
          course_name: courseData.course_name,
          category: courseData.category,
          course_instructor: courseData.course_instructor,
          capacity: courseData.capacity,
          registeredStudents: courseData.registeredStudents,
          isOpen: courseData.isOpen,
          prerequisite: courseData.prerequisite,
          image: courseData.image
        }
      });
      return course;
    } catch (error) {
      console.error("❌ createCourse error:", error);
      throw error;
    }
  }
}

export default new SystemRepo();