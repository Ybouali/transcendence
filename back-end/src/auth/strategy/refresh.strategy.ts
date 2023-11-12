import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh_token',
) {
  constructor(
    private config: ConfigService,
    private prismaService: PrismaService,
  ) {
    const secretOrKey: string = config.get('SECRET_JWT_TOKEN');

    super({
      jwtFromRequest: ExtractJwt.fromHeader('refresh_token'),
      secretOrKey,
      passReqCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const refresh_token = req.get('refresh_token').trim();

    // Get the user based on the id that comes from the refresh token
    const user = await this.prismaService.user.findUnique({
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

    // make sure the token owned by the user
    if (user.refreshToken !== refresh_token)
      throw new ForbiddenException('Access denied');

    return user;
  }
}
