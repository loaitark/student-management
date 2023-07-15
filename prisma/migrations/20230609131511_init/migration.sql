/*
  Warnings:

  - You are about to drop the column `section` on the `User` table. All the data in the column will be lost.
  - Added the required column `course_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "section",
ADD COLUMN     "course_id" INTEGER NOT NULL,
ADD COLUMN     "passwordChanegedAt" TIMESTAMP(3),
ADD COLUMN     "passwordRestCode" TEXT,
ADD COLUMN     "passwordRestExp" TIMESTAMP(3),
ADD COLUMN     "passwordRestVerified" BOOLEAN,
ALTER COLUMN "role" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "duration" INTEGER,
    "assignments" TEXT,
    "content" TEXT,
    "fullMarks" INTEGER,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
