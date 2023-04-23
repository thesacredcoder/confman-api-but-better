-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('AUTHOR', 'REVIEWER', 'CONFERENCE_MANAGER', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'AUTHOR',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "about" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paper" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "keywords" TEXT[],
    "rating" DOUBLE PRECISION,
    "plagScore" DOUBLE PRECISION,
    "fileUrl" TEXT NOT NULL,
    "plagReportUrl" TEXT,
    "verdict" BOOLEAN NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authorship" (
    "userId" INTEGER NOT NULL,
    "paperId" INTEGER NOT NULL,

    CONSTRAINT "Authorship_pkey" PRIMARY KEY ("userId","paperId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Authorship_paperId_userId_key" ON "Authorship"("paperId", "userId");

-- AddForeignKey
ALTER TABLE "Authorship" ADD CONSTRAINT "Authorship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authorship" ADD CONSTRAINT "Authorship_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
