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
    "avatarNamePath" TEXT,
    "isOnLine" BOOLEAN NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "twoFactor" BOOLEAN,
    "qrCodeFileName" TEXT,
    "towFactorSecret" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoryGame" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId1" TEXT NOT NULL,
    "userId2" TEXT NOT NULL,
    "winnerId" TEXT NOT NULL,
    "startTimeGame" TIMESTAMP(3) NOT NULL,
    "endTimeGame" TIMESTAMP(3) NOT NULL,
    "scoreUser1" INTEGER NOT NULL,
    "scoreUser2" INTEGER NOT NULL,

    CONSTRAINT "HistoryGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockedUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockedUser" TEXT NOT NULL,

    CONSTRAINT "blockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendShip" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sendFriendshipUser" TEXT NOT NULL,
    "requestedUser" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "friendShip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "directMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sendByUser" TEXT NOT NULL,
    "sendToUser" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "directMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
