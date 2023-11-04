import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor(
        private config: ConfigService,
        private prismaService: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET_KEY')
        })
    }

    async validate(payload: { sub: string, email: string }) {
        
        const user = await this.prismaService.user.findUnique({ where: { id: payload.sub }});

        delete user.password;

        return user;
    }
}