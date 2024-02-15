/* eslint-disable prettier/prettier */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BadRequestException, Body, Controller, Get, Param, Post, Req, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { MatchService } from "./match.service";
import { CreateMatchDto } from "./dto";
import { FileInterceptor } from "@nestjs/platform-express";
// import { Express } from 'express'; // Import Express type
// import { diskStorage } from 'multer'; // Import Multer's diskStorage
import * as path from 'path';
import * as fs from 'fs';


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

    @Get('profile/:id')
    getUserRankingAndWins(@Param('id') id: string) {
        return this.matchService.getUserRankingAndWins(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    addHistoryGame(@Body() createMatchDto : CreateMatchDto) {
        return this.matchService.addHistoryGame(createMatchDto);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ): Promise<{ message: string}> {
        try {
            const {username, id, fullname, email} = body;
            let filePath: string;
            await this.matchService.checkValues(username, id, fullname, email);
            console.log(file);
            if (!file) {
                filePath = path.join('/images/uploads/', 'default-avatar.png');
            } else {
                const uploadFolder = path.join(__dirname, '../../../../ConversationABDo-4/public/images/uploads');
                const uniqueFileName = `${Date.now()}-${file.originalname}-tran.png`;
                filePath = path.join(uploadFolder, uniqueFileName);
                await fs.promises.writeFile(filePath, file.buffer);
                filePath = "/images/uploads/" + uniqueFileName;
                console.log('File saved at:', filePath);
            }
            await this.matchService.updateValues(username, id, fullname, email, filePath);
            return { message: 'File uploaded successfully!' };
        } catch (error) {
            console.error('Error saving file:', error);
            throw new Error('Failed to save file.');
        }
    }

}
