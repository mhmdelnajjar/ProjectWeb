-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Course" (
    "course_number" TEXT NOT NULL PRIMARY KEY,
    "course_name" TEXT NOT NULL,
    "course_instructor" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "registeredStudents" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL,
    "category" TEXT,
    "prerequisite" TEXT NOT NULL,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "CourseRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseId" TEXT NOT NULL,
    "grade" TEXT,
    "completedById" INTEGER,
    "currentById" INTEGER,
    "pendingById" INTEGER,
    CONSTRAINT "CourseRecord_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("course_number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CourseRecord_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CourseRecord_currentById_fkey" FOREIGN KEY ("currentById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CourseRecord_pendingById_fkey" FOREIGN KEY ("pendingById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CourseAssignment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "courseId" TEXT NOT NULL,
    "instructorId" INTEGER NOT NULL,
    CONSTRAINT "CourseAssignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("course_number") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CourseAssignment_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Course_course_name_key" ON "Course"("course_name");
