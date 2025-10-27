/*
  Warnings:

  - You are about to drop the `_ManagedStudents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ManagedStudents" DROP CONSTRAINT "_ManagedStudents_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ManagedStudents" DROP CONSTRAINT "_ManagedStudents_B_fkey";

-- DropTable
DROP TABLE "public"."_ManagedStudents";
