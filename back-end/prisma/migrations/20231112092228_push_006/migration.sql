/*
  Warnings:

  - You are about to drop the column `loginToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `onLineToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "loginToken",
DROP COLUMN "onLineToken",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "refreshToken" TEXT;
