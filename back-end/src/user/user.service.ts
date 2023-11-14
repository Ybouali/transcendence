import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  Req,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async search(username: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: { username: { startsWith: username } },
        select: {
          username: true,
          avatarName: true,
          isOnLine: true,
        },
      });

      if (!users) {
        throw new NotFoundException();
      }

      return users;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async updateAvatar(user: User, @UploadedFile() file: Express.Multer.File) {
    try {
      // check if the file is a image file
      if (!file.mimetype.startsWith('image')) {
        throw new NotAcceptableException();
      }

      // check if user has already updated avatar if not change we need to change the name avatar in db
      if (user.avatarName === 'defaultAvatar.png') {
        // create the avatar name
        const avatarName =
          user.username + '_avatar.' + file.mimetype.split('/')[1];

        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { avatarName },
        });
      }

      // path of the avatar file
      const pathAvatar = this.config.get('PATH_AVATAR_USERS') + user.avatarName;

      // store the avatar
      fs.writeFileSync(pathAvatar, file.buffer);

      return { message: 'updated' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAvatar(nameAvatar: string, @Res() res?: Response) {
    try {
      const pathAvatar = this.config.get('PATH_AVATAR_USERS') + nameAvatar;

      console.log({ pathAvatar });

      res.sendFile(pathAvatar);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getRefreshToken(@Req() req?: Request): Promise<string> {
    const refresh_token = req.headers['refresh_token'].trim();

    return refresh_token;
  }
}
