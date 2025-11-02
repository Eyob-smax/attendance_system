/*
  Warnings:

  - Added the required column `department` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "department" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "StudentBatch" (
    "id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "join_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leave_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StudentBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentBatch_student_id_batch_id_key" ON "StudentBatch"("student_id", "batch_id");

-- AddForeignKey
ALTER TABLE "StudentBatch" ADD CONSTRAINT "StudentBatch_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBatch" ADD CONSTRAINT "StudentBatch_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "Batch"("batch_id") ON DELETE RESTRICT ON UPDATE CASCADE;
