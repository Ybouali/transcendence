import { User } from '@prisma/client';
import { UserService } from './user.service';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  Put,
  Logger,
} from '@nestjs/common';
import { GetUser } from 'src/decorators';
import { AccessGuard, LoginGuard } from 'src/auth/guard';
import { UpdateUserData } from './dto';

@UseGuards(AccessGuard, LoginGuard)
@Controller('users')
export class UserController {

  private logger = new Logger();

  constructor(private userService: UserService) {}

  @Get('/me')
  async getMe(@GetUser() user: User) {
    return user;
  }

  @Get('/:userId')
  async getUser(@Param('userId') userId: string): Promise<User> {
    return await this.userService.getUser(userId);
  }

  @Get('/:toFind')
  async search(@Param('toFind') toFind: string) {
    return this.userService.search(toFind);
  }

  @Put('/update')
  async updateUser(dataUser: UpdateUserData, @GetUser('id') userId: string) {
    return this.userService.updateUser(dataUser, userId);
  }
  
}
