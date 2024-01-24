import { Response } from 'express';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Put,
  Res,
  Logger,
} from '@nestjs/common';
import { GetUser } from 'src/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessGuard, LoginGuard } from 'src/auth/guard';
import { UpdateUserData } from './dto';

@UseGuards(LoginGuard, AccessGuard)
@Controller('users')
export class UserController {
  private logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get('/me')
  async getMe(@GetUser() user: User) {
  
    this.logger.debug(user);

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

  

  // @Put('/avatar')
  // @UseInterceptors(FileInterceptor('image'))
  // async updateAvatar(
  //   @GetUser() user: User,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return this.userService.updateAvatar(user, file);
  // }

  // @Get('/avatar/:nameAvatar')
  // async getAvatar(
  //   @Param('nameAvatar') nameAvatar: string,
  //   @Res() res: Response,
  // ) {
  //   return this.userService.getAvatar(nameAvatar, res);
  // }
}
