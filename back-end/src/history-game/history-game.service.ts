import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { HistoryGame, User } from '@prisma/client';
import { GetUser } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoryGameType } from 'src/types';

@Injectable()
export class HistoryGameService {

    private logger = new Logger(HistoryGameService.name);

    constructor (
        private prisma: PrismaService
    ) {}

    // TODO: create a history game 
    async createHistoryGame(@GetUser() user: User, historyGame: HistoryGameType ) {
        try {
            
            // create the history game based on the history game data the coomes from the args
            // const hGame: HistoryGame = await this.prisma.historyGame.create({
            //     data: {

            //     }
            // })


        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException();
        }
    }
    
    // TODO: create a get history game by id
    
    // TODO: define my perfect login for the leaderboard HHHHHHHHHHHHHHHHHHHHHHHHHHHHH
    
    // TODO: get the history for a specific user aka by id

    // TODO: get all the history games , need to implement pagination for having fun with my code HHHHHHHHHHHHHHHHH

}
