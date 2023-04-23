-- CreateEnum
CREATE TYPE "ConferenceStatus" AS ENUM ('ONGOING', 'CLOSED', 'UPCOMING');

-- AlterTable
ALTER TABLE "Paper" ADD COLUMN     "conferenceId" INTEGER;

-- CreateTable
CREATE TABLE "Conference" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "ConferenceStatus" NOT NULL,
    "topics" TEXT[],
    "organization" TEXT NOT NULL,
    "managerId" INTEGER NOT NULL,

    CONSTRAINT "Conference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConferenceReviewers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ConferenceAuthors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConferenceReviewers_AB_unique" ON "_ConferenceReviewers"("A", "B");

-- CreateIndex
CREATE INDEX "_ConferenceReviewers_B_index" ON "_ConferenceReviewers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConferenceAuthors_AB_unique" ON "_ConferenceAuthors"("A", "B");

-- CreateIndex
CREATE INDEX "_ConferenceAuthors_B_index" ON "_ConferenceAuthors"("B");

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_conferenceId_fkey" FOREIGN KEY ("conferenceId") REFERENCES "Conference"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conference" ADD CONSTRAINT "Conference_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConferenceReviewers" ADD CONSTRAINT "_ConferenceReviewers_A_fkey" FOREIGN KEY ("A") REFERENCES "Conference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConferenceReviewers" ADD CONSTRAINT "_ConferenceReviewers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConferenceAuthors" ADD CONSTRAINT "_ConferenceAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "Conference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConferenceAuthors" ADD CONSTRAINT "_ConferenceAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
