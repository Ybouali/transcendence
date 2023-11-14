import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { PrismaService } from './prisma/prisma.service';
import { Interval } from '@nestjs/schedule';
import { EncryptionService } from './encryption/encryption.service';
import * as jwt from 'jsonwebtoken';
import { Jwts } from './types';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private encrypt: EncryptionService,
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
    let users: User[] = await this.getUsers();

    if (users) {
      // loop through all the users
      for (let user of users) {
        try {
          // get the jwt token from the user
          const tokenToVerify: string = await this.encrypt.decrypt(
            user.refreshToken,
          );

          // if the throw exeption so the user should be signed again
          if (this.verifyJwtToken(tokenToVerify)) {
            // update the user
            await this.prisma.user.update({
              where: { id: user.id },
              data: {
                isOnLine: false,
                accessToken: 'offline',
                refreshToken: 'logout',
              },
            });

            // log the user that the server forced to loged out
            this.logger.log(`User ${user.email} Is logged out `);
          }
        } catch (error) {
          throw new InternalServerErrorException();
        }
      }
    }

    users = await this.getUsers();

    if (users) {
      // loop through all the users
      for (let user of users) {
        try {
          // get the jwt token from the user
          const tokenToVerify: string = await this.encrypt.decrypt(
            user.accessToken,
          );

          // if the throw exeption so the user should be signed again
          if (this.verifyJwtToken(tokenToVerify)) {
            // update the user
            await this.prisma.user.update({
              where: { id: user.id },
              data: {
                isOnLine: false,
                accessToken: 'offline',
              },
            });

            // log the user that the server forced to refresh the asscess token
            this.logger.log(`User ${user.email} Is Off Line `);
          }
        } catch (error) {
          throw new InternalServerErrorException();
        }
      }
    }
  }

  verifyJwtToken(tokenToVerify: string) {
    try {
      // get the secret from the config service
      const secret = this.config.get('SECRET_JWT_TOKEN');

      // decode the token
      const tokenDecoded: Jwts = jwt.decode(tokenToVerify, secret) as Jwts;

      // check the expiration date of the token

      // get the current date
      // divide by 1000 to convert to seconds
      const dateNow: number = Math.floor(Date.now() / 1000);

      // check expiration
      if (dateNow > tokenDecoded.exp) return true;
      return false;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUsers(): Promise<User[]> {
    const users: User[] = await this.prisma.user.findMany({
      where: {
        NOT: [{ refreshToken: 'logout' }, { accessToken: 'offline' }],
      },
    });

    return users;
  }
}
