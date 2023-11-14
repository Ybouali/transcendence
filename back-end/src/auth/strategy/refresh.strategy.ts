import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { EncryptionService } from 'src/encryption/encryption.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private encrypt: EncryptionService,
  ) {
    const secretOrKey: string = config.get('SECRET_JWT_TOKEN');
    super({
      jwtFromRequest: ExtractJwt.fromHeader('refresh'),
      secretOrKey,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const refresh_token = req.get('refresh_token').trim();

    // Get the user based on the id that comes from the refresh token
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        username: true,
        refreshToken: true,
      },
    });

    // if the user is not found
    if (!user) throw new ForbiddenException('Access denied');

    // extract the access token from the user
    const refreshToken: string = await this.encrypt.decrypt(user.refreshToken);

    // check if the refresh token is matched against the refresh token that comes from request

    if (refreshToken !== refresh_token)
      throw new ForbiddenException('Access denied');

    return user;
  }
}
