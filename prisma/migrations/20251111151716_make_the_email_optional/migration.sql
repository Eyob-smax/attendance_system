-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'admin';
