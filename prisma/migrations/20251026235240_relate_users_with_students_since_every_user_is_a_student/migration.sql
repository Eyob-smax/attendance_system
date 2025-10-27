-- CreateTable
CREATE TABLE "_ManagedStudents" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ManagedStudents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ManagedStudents_B_index" ON "_ManagedStudents"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ManagedStudents" ADD CONSTRAINT "_ManagedStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ManagedStudents" ADD CONSTRAINT "_ManagedStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
