import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { PrismaService } from './prisma/prisma.service';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  init_server(): void {
    const path_avatars = this.config.get('PATH_AVATAR_USERS');

    // check for the folder of avatar users is exist
    // if not, create the folder and log a worning
    if (!fs.existsSync(path_avatars)) {
      this.logger.error(
        `Make suer to add a image for the default Avatar at ${path_avatars}`,
      );

      fs.mkdir(path_avatars, (err) => {
        if (err) {
          this.logger.error(
            `Could not create the folder (${path_avatars}) , Make sure to create this folder by yourself :)`,
          );
        }
      });
    }

    const path_qr_codes = this.config.get('PATH_QR_CODES');

    // check if the folder of the qrcodes is exist
    if (!fs.existsSync(path_qr_codes)) {
      fs.mkdir(path_qr_codes, (err) => {
        if (err) {
          this.logger.error(
            `Could not create the folder (${path_qr_codes}) , Make sure to create this folder by yourself :)`,
          );
        }
      });
    }
  }

  @Interval(5000)
  async onlineOffLineUsers() {
    // Get all the users
    let users: User[] = await this.prisma.user.findMany();

    if (users) {
      // loop through all the users
      for (let user of users) {
        try {
          // if the throw exeption so the user is offLine
          this.jwtService.verify(user.refreshToken);
        } catch (error) {
          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              isOnLine: false,
              accessToken: null,
            },
          });
        }
      }
    }

    if (users) {
      // loop through all the users
      for (let user of users) {
        try {
          // if the throw exeption so the user should login again
          this.jwtService.verify(user.accessToken);
        } catch (error) {
          this.logger.log(`User ${user.email} Is logged Out `);

          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              refreshToken: null,
            },
          });
        }
      }
    }
  }
}
