import { Controller, UseGuards } from '@nestjs/common';
import { AccessStrategy, RefreshStrategy } from 'src/auth/strategy';
import { HistoryGameService } from './history-game.service';

@UseGuards(RefreshStrategy, AccessStrategy)
@Controller('history-game')
export class HistoryGameController {

    constructor (private historyGameService: HistoryGameService) { }
    
}
