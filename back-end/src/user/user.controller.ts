import { User } from '@prisma/client';
import { UserService } from './user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/decorators';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Get('/me')
    async getMe(@GetUser() user: User) {
        return user;
    }
}
