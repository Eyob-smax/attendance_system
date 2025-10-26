/*
  Warnings:

  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Attendance" DROP CONSTRAINT "Attendance_student_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Certificate" DROP CONSTRAINT "Certificate_student_id_fkey";

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "student_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Certificate" ALTER COLUMN "student_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
ALTER COLUMN "student_id" DROP DEFAULT,
ALTER COLUMN "student_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id");
DROP SEQUENCE "Student_student_id_seq";

-- DropTable
DROP TABLE "public"."employee";

-- DropEnum
DROP TYPE "public"."ROLE_TYPE";

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;
