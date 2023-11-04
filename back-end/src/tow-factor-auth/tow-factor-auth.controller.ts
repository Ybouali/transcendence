import { Controller, Get, UseGuards, Res, Post, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { Response }  from 'express'
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators';
import { TowFactorAuthService } from './tow-factor-auth.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('tow-factor-auth')
export class TowFactorAuthController {

    constructor(private towFactorAuthService: TowFactorAuthService) { }

    @Get('/validated')
    async validate(@GetUser() user: User, @Res() res: Response) {
        return this.towFactorAuthService.validate(user, res);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/confirm/:code')
    async confirm(@GetUser() user: User, @Param('code') code: string) {
        return this.towFactorAuthService.confirm(user, code);
    }
}
