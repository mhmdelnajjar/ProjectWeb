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

  // Get pending course requests
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

  // Approve/reject course request
  async handleCourseRequest(studentId, courseNumber, isApproved) {
    // Remove from pending
    await prisma.courseRecord.deleteMany({
      where: {
        pendingById: parseInt(studentId),
        courseId: courseNumber
      }
    });

    if (isApproved) {
      // Add to current courses
      await prisma.courseRecord.create({
        data: {
          courseId: courseNumber,
          currentById: parseInt(studentId)
        }
      });

      // Decrement course capacity
      await prisma.course.update({
        where: { course_number: courseNumber },
        data: {
          registeredStudents: {
            increment: 1
          }
        }
      });
    }

    return true;
  }

  // Toggle course approval status
  async toggleCourseApproval(courseNumber, isOpen) {
    return await prisma.course.update({
      where: { course_number: courseNumber },
      data: { isOpen }
    });
  }

  // Delete course
  async deleteCourse(courseNumber) {
    return await prisma.course.delete({
      where: { course_number: courseNumber }
    });
  }
  async updateGrade(studentId, courseNumber, grade) {
    try {
      await prisma.courseRecord.updateMany({
        where: {
          studentId: parseInt(studentId),
          courseId: courseNumber
        },
        data: {
          grade: grade
        }
      });
      return true;
    } catch (error) {
      console.error("❌ updateGrade error:", error);
      throw error;
    }
  }
  
  
  
  
  // Bulk approve/reject courses
  async bulkUpdateCourses(isOpen) {
    return await prisma.course.updateMany({
      data: { isOpen }
    });
  }

  // Bulk approve/reject requests
  async bulkHandleRequests(isApproved) {
    if (isApproved) {
      // Move all pending to current
      const pendingRecords = await prisma.courseRecord.findMany({
        where: { pendingById: { not: null } }
      });

      await prisma.$transaction([
        prisma.courseRecord.deleteMany({
          where: { pendingById: { not: null } }
        }),
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
            course_number: { 
              in: pendingRecords.map(r => r.courseId) 
            } 
          },
          data: { 
            registeredStudents: { 
              increment: 1 
            } 
          }
        })
      ]);
    } else {
      // Just delete all pending
      await prisma.courseRecord.deleteMany({
        where: { pendingById: { not: null } }
      });
    }

    return true;
  }

    // USER METHODS (NEW)
    // ======================
    async getUsers() {
      return await prisma.user.findMany();
    }
  
    async getUserByEmail(email) {
      return await prisma.user.findUnique({
        where: { username: email }
      });
    }
  
    // ======================
    // EXISTING COURSE METHODS
    // ======================
    async getCourses() {
      return await prisma.course.findMany();
    }
  
    async getCurrentCourses(email) {
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
  
    async updatePending(email, courseNumber) {
      try {
        const user = await prisma.user.findUnique({
          where: { username: email },
        });
        
        const course = await prisma.course.findUnique({
          where: { course_number: courseNumber }
        });
  
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
      try {
        const assignments = await prisma.courseAssignment.findMany({
          where: {
            instructor: {
              username: instId
            }
          },
          include: {
            course: true
          }
        });
  
        const coursesWithStudents = await Promise.all(
          assignments.map(async (assignment) => {
            const studentRecords = await prisma.courseRecord.findMany({
              where: {
                courseId: assignment.courseId,
                currentById: { not: null }
              },
              include: {
                currentBy: true
              }
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
      } catch (error) {
        console.error("Error in getAssigned:", error);
        throw error;
      }
    }
  
    // ======================
    // GRADE MANAGEMENT
    // ======================
    async updateGrade(studentId, courseNumber, grade) {
      try {
        await prisma.courseRecord.updateMany({
          where: {
            currentById: parseInt(studentId),
            courseId: courseNumber
          },
          data: {
            grade: grade
          }
        });
        return true;
      } catch (error) {
        console.error("❌ updateGrade error:", error);
        throw error;
      }
    }
  }



export default new SystemRepo()