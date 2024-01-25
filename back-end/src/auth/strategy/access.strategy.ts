import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { EncryptionService } from 'src/encryption/encryption.service';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {

  constructor(
    private prisma: PrismaService,
    private encrypt: EncryptionService,
  ) {
    const secretOrKey: string = process.env.SECRET_JWT_TOKEN;
    super({
      jwtFromRequest: ExtractJwt.fromHeader('access_token'),
      secretOrKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const access_token = req.get('access_token').trim();

    // Get the user based on the id that comes from the refresh token
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        avatarNameUrl: true,
        isOnLine: true,
        accessToken: true,
        levelGame: true,
      }
    });

    // if the user is not found
    if (!user) throw new ForbiddenException('Access denied');


    // extract the access token from the user
    const accessToken: string = (await this.encrypt.decrypt(user.accessToken));

    // check if the refresh token is matched against the refresh token that comes from request
    if (accessToken !== access_token)
      throw new ForbiddenException('Access denied');

    delete user.accessToken;

    return user;
  }
}
