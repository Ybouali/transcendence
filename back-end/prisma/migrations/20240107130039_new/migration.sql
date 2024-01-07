-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "avatarName" TEXT NOT NULL,
    "avatarupdated" BOOLEAN NOT NULL,
    "avatarNamePath" TEXT NOT NULL,
    "isOnLine" BOOLEAN NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "twoFactor" BOOLEAN NOT NULL,
    "qrCodeFileName" TEXT NOT NULL,
    "towFactorSecret" TEXT NOT NULL,
    "historyGameId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryGame" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winnerId" TEXT NOT NULL,
    "startTimeGame" TIMESTAMP(3) NOT NULL,
    "endTimeGame" TIMESTAMP(3) NOT NULL,
    "scoreUser1" INTEGER NOT NULL,
    "scoreUser2" INTEGER NOT NULL,

    CONSTRAINT "HistoryGame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_historyGameId_key" ON "User"("historyGameId");
