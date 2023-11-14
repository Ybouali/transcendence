import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from 'src/types';
import { GetUser } from 'src/decorators';
import { User } from '@prisma/client';
import { EncryptionService } from 'src/encryption/encryption.service';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private encript: EncryptionService,
  ) {}

  async signup(dto: AuthDto): Promise<Tokens> {
    try {
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
          accessToken: 'token',
          refreshToken: 'token',
        },
      });

      // generate the tokens and store the email address and username in the jwt token
      const tokens: Tokens = await this.generateTokens(user.id, user.email);

      const hashAT: string = await this.encript.encrypt(tokens.access_token);

      const hashRT: string = await this.encript.encrypt(tokens.refresh_token);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { accessToken: hashAT, refreshToken: hashRT },
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
      user.username,
      user.email,
      60 * 5,
    );

    const hashAT: string = await this.encript.encrypt(access_token);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { accessToken: hashAT, isOnLine: true },
    });

    return {
      access_token,
    };
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

      // get tokens for the login user
      const tokens: Tokens = await this.generateTokens(
        user.username,
        user.email,
      );

      // hash the tokens

      const hashAT: string = await argon2.hash(tokens.access_token);

      const hashRT: string = await argon2.hash(tokens.refresh_token);

      this.logger.log(
        `A Fin a ba ${user.username}, a mrahba bik a moulay o hawl 3la server rah 3la 9ad lhal HHHHHHHHHHHHH`,
      );

      // update the user . store the tokens in the database
      await this.prisma.user.update({
        where: { id: user.id },
        data: { accessToken: hashAT, refreshToken: hashRT },
      });

      return tokens;
    } catch (error) {
      throw new NotAcceptableException();
    }
  }

  async generateTokens(username: string, email: string): Promise<Tokens> {
    try {
      // generate the tokens for the user
      const [at, rt] = await Promise.all([
        this.generateJwtToken(username, email, 60 * 5),
        this.generateJwtToken(username, email, 60 * 60 * 24 * 7),
      ]);

      return {
        access_token: at,
        refresh_token: rt,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // generate the JWT token
  async generateJwtToken(
    username: string,
    email: string,
    expiresIn: number,
  ): Promise<string> {
    const secret: string = this.config.get('SECRET_JWT_TOKEN');

    const token = this.jwt.sign(
      {
        sub: username,
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
