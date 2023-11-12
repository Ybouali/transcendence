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
} from '@nestjs/common';
import { GetUser } from 'src/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessStrategy, RefreshStrategy } from 'src/auth/strategy';

@UseGuards(RefreshStrategy, AccessStrategy)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  async getMe(@GetUser() user: User) {
    return user;
  }

  @Get('/:toFind')
  async search(@Param('toFind') toFind: string) {
    return this.userService.search(toFind);
  }

  @Put('/avatar')
  @UseInterceptors(FileInterceptor('image'))
  async updateAvatar(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(user, file);
  }

  @Get('/avatar/:nameAvatar')
  async getAvatar(
    @Param('nameAvatar') nameAvatar: string,
    @Res() res: Response,
  ) {
    return this.userService.getAvatar(nameAvatar, res);
  }
}
