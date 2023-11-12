import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const secretOrKey: string = config.get('SECRET_JWT_TOKEN');
    super({
      jwtFromRequest: ExtractJwt.fromHeader('refresh_token'),
      secretOrKey,
      passReqCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string }) {
    const access_token = req.get('access_token').trim();

    // Get the user based on the id that comes from the refresh token
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        username: true,
        accessToken: true,
      },
    });

    // if the user is not found
    if (!user) throw new ForbiddenException('Access denied');

    // make sure the token owned by the user
    if (user.accessToken !== access_token)
      throw new ForbiddenException('Access denied');

    return user;
  }
}
