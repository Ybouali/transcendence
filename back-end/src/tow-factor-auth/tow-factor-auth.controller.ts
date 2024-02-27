import {
  Controller,
  Get,
  UseGuards,
  Res,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators';
import { TowFactorAuthService } from './tow-factor-auth.service';
import { AccessStrategy, RefreshStrategy } from 'src/auth/strategy';

@UseGuards(RefreshStrategy, AccessStrategy)
@Controller('tow-factor-auth')
export class TowFactorAuthController {
  private logger = new Logger(TowFactorAuthController.name);
  constructor(private towFactorAuthService: TowFactorAuthService) {}

  @Get('/validated')
  async validate(@GetUser() user: User, @Res() res: Response) {
    this.logger.debug({
      user
    })
    return this.towFactorAuthService.validate(user, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/confirm/:code')
  async confirm(@GetUser() user: User, @Param('code') code: string) {
    return this.towFactorAuthService.confirm(user, code);
  }
}
