/*
  Warnings:

  - A unique constraint covering the columns `[student_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `student_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "student_id" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_student_id_key" ON "User"("student_id");
