/*
  Warnings:

  - You are about to drop the `Authorship` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Paper` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Authorship" DROP CONSTRAINT "Authorship_paperId_fkey";

-- DropForeignKey
ALTER TABLE "Authorship" DROP CONSTRAINT "Authorship_userId_fkey";

-- AlterTable
ALTER TABLE "Paper" ADD COLUMN     "authorId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Authorship";

-- CreateTable
CREATE TABLE "_CoAuthor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CoAuthor_AB_unique" ON "_CoAuthor"("A", "B");

-- CreateIndex
CREATE INDEX "_CoAuthor_B_index" ON "_CoAuthor"("B");

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoAuthor" ADD CONSTRAINT "_CoAuthor_A_fkey" FOREIGN KEY ("A") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoAuthor" ADD CONSTRAINT "_CoAuthor_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
