import { UserService } from './user.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @UseGuards(JwtGuard)
    @Get('/me')
    async getMe(@Req() req: Request) {
        return req.user;
    }
}
