/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { MatchService } from "./match.service";
import { CreateMatchDto } from "./dto";



@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService){}

    @Get('leaderboard')
    getLeaderBoard() {
        return this.matchService.getLeaderBoard();
    }

    @Get(':id')
    getHistoryAllGames(@Param('id') id: string) {
        return this.matchService.getHistoryAllGames(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    addHistoryGame(@Body() createMatchDto : CreateMatchDto) {
        return this.matchService.addHistoryGame(createMatchDto);
    }

}