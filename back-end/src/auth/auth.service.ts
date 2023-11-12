import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types';
import { GetUser } from 'src/decorators';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<Tokens> {
    try {
      console.log({
        dto,
      });
      // Hash the password
      const hash: string = await argon2.hash(dto.password);

      // generate a name from the email address
      let name: string = dto.email.split('@')[0];

      // store the user into db
      const user = await this.prisma.user.create({
        data: {
          username: name,
          email: dto.email,
          verifiedEmail: false,
          password: hash,
          avatarName: 'defaultAvatar.png',
          isOnLine: true,
        },
        select: {
          id: true,
          email: true,
        },
      });

      const tokens: Tokens = await this.generateTokens(user.id, user.email);

      // ! NOTE: this code dose not work ,
      // store Or update the user tokens
      const newUser = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        },
        select: {},
      });

      console.log({
        newUser,
      });

      // return the token for a signed up user
      return tokens;
    } catch (error) {
      console.log({
        message: error.message,
      });
      throw new NotAcceptableException();
    }
  }

  async refreshToken(@GetUser() user: User): Promise<{ access_token: string }> {
    const access_token: string = await this.generateJwtToken(
      user.id,
      user.email,
      60 * 5,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { accessToken: access_token },
    });

    return {
      access_token,
    };
  }

  async generateTokens(userId: string, email: string): Promise<Tokens> {
    try {
      // generate the tokens for the user
      const [at, rt] = await Promise.all([
        this.generateJwtToken(userId, email, 60 * 5),
        this.generateJwtToken(userId, email, 60 * 60 * 24 * 7),
      ]);

      return {
        access_token: at,
        refresh_token: rt,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async signin(dto: AuthDto) {
    try {
      // get the user by email address
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      // verify user password
      const isMatch = await argon2.verify(user.password, dto.password);

      if (!isMatch) {
        throw new NotAcceptableException();
      }

      return await this.generateTokens(user.id, user.email);
    } catch (error) {
      throw new NotAcceptableException();
    }
  }

  // generate the JWT token
  async generateJwtToken(
    userId: string,
    email: string,
    expiresIn: number,
  ): Promise<string> {
    const secret: string = this.config.get('SECRET_JWT_TOKEN');

    const token = this.jwt.sign(
      {
        sub: userId,
        email,
      },
      {
        secret,
        expiresIn,
      },
    );

    return token;
  }
}
