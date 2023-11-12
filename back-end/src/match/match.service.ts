/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMatchDto } from "./dto";


@Injectable()
export class MatchService {
    constructor(private prisma: PrismaService) {}
    async getHistoryAllGames(id: string) {
        const matches = await this.prisma.historyGame.findMany({
            where: {
                OR: [
                    { userId1: id },
                    { userId2: id },
                ],
            },
            select: {
                user1: {
                    select: { username: true },
                },
                user2: {
                    select: { username: true },
                },
                winner: {
                    select: { username: true },
                },
                scoreUser1: true,
                scoreUser2: true,
                endTimeGame: true,
            },
            orderBy: {
                endTimeGame: 'desc'
            },
            take: 3
        });
        return matches;
    }

    async addHistoryGame(createMatchDto: CreateMatchDto) {
        // Fetch user data for both players
        const winner = await this.prisma.user.findUnique({
        where: { id: createMatchDto.winnerId },
    });
    
    const loser = await this.prisma.user.findUnique({
        where: {
        id:
            createMatchDto.winnerId === createMatchDto.userId1
            ? createMatchDto.userId2
            : createMatchDto.userId1,
        },
    });
    
    if (winner && loser) {
        // Fetch and update the stats for the winner
        const winnerStats = await this.prisma.stats.findUnique({
        where: { userId: winner.id },
        });
    
        if (winnerStats) {
        await this.prisma.stats.update({
            where: { userId: winner.id },
            data: { wins: winnerStats.wins + 1 },
        });
        }
    
        // Fetch and update the stats for the loser
        const loserStats = await this.prisma.stats.findUnique({
        where: { userId: loser.id },
        });
    
        if (loserStats) {
        await this.prisma.stats.update({
            where: { userId: loser.id },
            data: { loses: loserStats.loses + 1 },
        });
        }
    
        // Create the history game record
        const newHistoryGame = await this.prisma.historyGame.create({
        data: {
            userId1: createMatchDto.userId1,
            userId2: createMatchDto.userId2,
            startTimeGame: createMatchDto.startTimeGame,
            endTimeGame: createMatchDto.endTimeGame,
            scoreUser1: createMatchDto.scoreUser1,
            scoreUser2: createMatchDto.scoreUser2,
            winnerId: createMatchDto.winnerId,
        },
        });
    
        return newHistoryGame;
    } else {
        throw new Error("invalide data");
    }
    }

    async getLeaderBoard() {
        const leaderBoard = await this.prisma.user.findMany({
        select: {
            username: true,
            stats: {
                select: {
                    wins: true
                }
            }
        },
        orderBy: {
            stats: {
                wins: 'desc'
            }
        },
        take: 20
        });
        return leaderBoard;
    }

    async getUserRankingAndWins(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                username: true,
                avatarUrl: true,
                stats: {
                    select: {
                    wins: true,
                    },
                },
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
            
        const userWins = user.stats.wins;
        const ranking = await this.prisma.$queryRaw`
            SELECT COUNT(*) + 1 as ranking
            FROM "User" u
            JOIN "Stats" s ON u.id = s."userId"
            WHERE s.wins > ${userWins}
        `;
        const rankingBigInt = BigInt(ranking[0].ranking);
        const rankingString = rankingBigInt.toString();
        return {
            avatar: user.avatarUrl,
            username: user.username,
            wins: userWins,
            ranking: rankingString,
        };
    }
    
}