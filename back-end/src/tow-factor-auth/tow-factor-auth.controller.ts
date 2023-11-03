import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators';
import { TowFactorAuthService } from './tow-factor-auth.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('tow-factor-auth')
export class TowFactorAuthController {

    constructor(private towFactorAuthService: TowFactorAuthService) { }

    @Get('/validated')
    async validate(@GetUser() user: User) {
        return this.towFactorAuthService.validate(user);
    }
}
