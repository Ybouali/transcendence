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

    async addHistoryGame(createMatchDto: CreateMatchDto){
        const newHistoryGame = await this.prisma.historyGame.create({
            data: {
                userId1: createMatchDto.userId1,
                userId2: createMatchDto.userId2,
                startTimeGame: createMatchDto.startTimeGame,
                endTimeGame: createMatchDto.endTimeGame,
                scoreUser1: createMatchDto.scoreUser1,
                scoreUser2: createMatchDto.scoreUser2,
                winnerId: createMatchDto.winnerId
            }
        });

        return newHistoryGame;
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
}