import { Injectable, InternalServerErrorException, Logger, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { HistoryGame, User } from '@prisma/client';
import { GetUser } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoryGameType } from './dto';

@Injectable()
export class HistoryGameService {

    private logger = new Logger(HistoryGameService.name);

    constructor (
        private prisma: PrismaService
    ) {}


    


    async createHistoryGame(dataGame: HistoryGameType) {

        // Note: when this method is called u need to make sure id winner is oned to his score 
        // because this method dose not know if that score is oned to that user

        try {
            
            // need to check if the users is is exist for the winner and loser 
            const userWinner = await this.prisma.user.findFirst({ where: { id: dataGame.winnerId }})

            if (!userWinner) {
                throw new NotFoundException();
            }

            const userLoser = await this.prisma.user.findFirst({ where: { id: dataGame.loserId }})

            if (!userLoser) {
                throw new NotFoundException();
            }

            // make sure the score's are positif numbers 
            if (dataGame.scoreWinner < 0 || dataGame.scoreLoser < 0 ) {
                throw new NotAcceptableException();
            }

            // create the history game 
            const hGame = await this.prisma.historyGame.create({ 
                data: {
                    winnerId: dataGame.winnerId,
                    loserId: dataGame.loserId,
                    scoreWinner: dataGame.scoreWinner,
                    scoreLoser: dataGame.scoreLoser,
                }
             })

            // update the level for the winner
            this.logiqueLevel(userWinner.id);
            
            // update the level for the loser
            this.logiqueLevel(userLoser.id)

        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException();
        }
    }

    async numberGameWinned(userId: string): Promise< { numberWinnedGame: number } > {

        const user = await this.prisma.user.findFirst({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException();
        }

        const numberWinnedGame = await this.prisma.historyGame.count({ where: { winnerId: userId } });

        return {
            numberWinnedGame
        }
    }

    async numberGameLosed(userId: string): Promise< { numberWinnedLosed: number } > {

        // check if the id exist as a user
        const user = await this.prisma.user.findFirst({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException();
        }

        const numberWinnedLosed = await this.prisma.historyGame.count({ where: { loserId: userId } });

        return {
            numberWinnedLosed
        }
    }

    // there is 20 level every level will be accessible if the user has been winned 50 game per level 
    // so if u wanna get the 20 level u should win 1000 game 
    // to make this more intresting the level will decrease if the player has been lose 50
    // so if the player has been lose 1000 game his level will 0
    private async logiqueLevel (userId: string) {

        const gamesWinned: number = await this.prisma.historyGame.count({ where: { winnerId: userId } });

        const gameslosed: number = await this.prisma.historyGame.count({ where: { loserId: userId } });

        const percentageLevelWin = this.getPercentage(gamesWinned);

        const percentageLevelLos = this.getPercentage(gameslosed);

        const levelW = percentageLevelWin * gamesWinned;

        const levelL = percentageLevelLos * gamesWinned;

        let level = levelW - levelL;

        if (level < 0) {
            level *= -1;
        }

        const user = this.prisma.user.update({
            where: { id: userId },
            data: {
                levelGame: level
            }
        })

        if (!user) {
            throw new NotFoundException();
        }
    }


    private getPercentage(numberGames: number) {

        if (numberGames > 0 && numberGames <= 50) {
            return 50 / 1000;
        } else if (numberGames > 50 && numberGames <= 100) {
            return 100 / 1000;
        } else if (numberGames > 100 && numberGames <= 150) {
            return 150 / 1000;
        } else if (numberGames > 150 && numberGames <= 200) {
            return 200 / 1000;
        } else if (numberGames > 200 && numberGames <= 250) {
            return 250 / 1000;
        } else if (numberGames > 250 && numberGames <= 300) {
            return 300 / 1000;
        } else if (numberGames > 300 && numberGames <= 350) {
            return 350 / 1000;
        } else if (numberGames > 350 && numberGames <= 400) {
            return 400 / 1000;
        } else if (numberGames > 400 && numberGames <= 450) {
            return 450 / 1000;
        } else if (numberGames > 450 && numberGames <= 500) {
            return 500 / 1000;
        } else if (numberGames > 500 && numberGames <= 550) {
            return 550 / 1000;
        } else if (numberGames > 550 && numberGames <= 600) {
            return 600 / 1000;
        } else if (numberGames > 600 && numberGames <= 650) {
            return 650 / 1000;
        } else if (numberGames > 650 && numberGames <= 700) {
            return 700 / 1000;
        } else if (numberGames > 700 && numberGames <= 750) {
            return 750 / 1000;
        } else if (numberGames > 750 && numberGames <= 800) {
            return 800 / 1000;
        } else if (numberGames > 800 && numberGames <= 850) {
            return 850 / 1000;
        } else if (numberGames > 850 && numberGames <= 900) {
            return 900 / 1000;
        } else if (numberGames > 900 && numberGames <= 950) {
            return 950 / 1000;
        } else {
            return 1;
        }
    }
}
