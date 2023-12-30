/*
  Warnings:

  - You are about to drop the column `userId1` on the `HistoryGame` table. All the data in the column will be lost.
  - You are about to drop the column `userId2` on the `HistoryGame` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[historyGameId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HistoryGame" DROP COLUMN "userId1",
DROP COLUMN "userId2";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "historyGameId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_historyGameId_key" ON "User"("historyGameId");
