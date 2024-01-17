import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  Req,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import { Request, Response } from 'express';
import { UpdateUserData } from './dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) {}

  // get user by id
  async getUser(id: string): Promise<User> {

    const user = await this.prisma.user.findUnique({ where: { id: id }});

    if (!user) {
      throw new NotFoundException();
    }

    return user;

  }

  async updateUser(dataUser: UpdateUserData, userId: string): Promise<User> {

    // make sure the user is existing in db

    const checkUser = await this.prisma.user.findFirst({ where: { id: dataUser.id } });

    if (!dataUser) {
      throw new NotFoundException();
    }

    // make sure the user has right to update by checking that the id is his id
    if (dataUser.id !== userId) {
      throw new NotAcceptableException();
    }

    // check if the url avatar is images url

    // split the url by the .
    const resSplit: string[] = dataUser.avatarNameUrl.split(".")

    // get the last element
    const exeFile: string = resSplit[resSplit.length - 1];

    // if the exeFile is not one of this 3 exe throw a error
    if (exeFile !== "png" && exeFile !== "jpg" && exeFile !== "jpeg") {
      throw new NotAcceptableException();
    }

    const user = this.prisma.user.update(
      {
        where: { id: userId},
        data: {
          username: dataUser.username,
          fullName: dataUser.fullName,
          avatarNameUrl: dataUser.avatarNameUrl
        }
      }
    )

    return user;
  }

  async search(username: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: { username: { startsWith: username } },
        select: {
          username: true,
          avatarNameUrl: true,
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

  // async updateAvatar(user: User, @UploadedFile() file: Express.Multer.File) {
  //   try {
  //     // check if the file is a image file
  //     if (!file.mimetype.startsWith('image')) {
  //       throw new NotAcceptableException();
  //     }

  //     // check if user has already updated avatar if not change we need to change the name avatar in db
  //     if (user.avatarName === 'defaultAvatar.png') {
  //       // create the avatar name
  //       const avatarName =
  //         user.username + '_avatar.' + file.mimetype.split('/')[1];

  //       user = await this.prisma.user.update({
  //         where: { id: user.id },
  //         data: { avatarName },
  //       });
  //     }

  //     // path of the avatar file
  //     const pathAvatar = process.env.PATH_AVATAR_USERS + user.avatarName;

  //     // store the avatar
  //     fs.writeFileSync(pathAvatar, file.buffer);

  //     return { message: 'updated' };
  //   } catch (error) {
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async getAvatar(nameAvatar: string, @Res() res?: Response) {
  //   try {
  //     const pathAvatar = process.env.PATH_AVATAR_USERS + nameAvatar;

  //     console.log({ pathAvatar });

  //     res.sendFile(pathAvatar);
  //   } catch (error) {
  //     throw new NotFoundException();
  //   }
  // }

  async getRefreshToken(@Req() req?: Request): Promise<string> {
    
    const refresh_token = (req.headers['refresh_token'] as string).trim();

    return refresh_token;
  }
}
