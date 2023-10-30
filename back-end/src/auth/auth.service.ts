import { Injectable, NotAcceptableException } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from "argon2";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

    async signup (dto: AuthDto) {

        try {

            // Hash the password
            const hash = await argon2.hash(dto.password);
            
            // generate a name from the email address 
            const name = dto.email.split('@')[0];

            // store the user into db
            const user = await this.prisma.user.create({
                data: {
                    username: name,
                    email: dto.email,
                    verifiedEmail: false,
                    password: hash,
                    avatarUrl: 'https://pics.freeicons.io/uploads/icons/png/16671574911586787867-512.png',
                    Status: true,
                    twoFactor: false
                }
            });
            
            // return the token for a signed up user 
            return this.signToken(user.id, user.email, user.username);

        } catch (error) {
            throw new NotAcceptableException();
        }
    }
    
    async signin (dto: AuthDto) {
        
        try {
            
            // get the user by email address
            const user = await this.prisma.user.findUnique({
                where: { email: dto.email }
            });

            // verify user password

            const isMatch = await argon2.verify(user.password, dto.password);

            if (!isMatch) {
                throw new NotAcceptableException();
            }

            return this.signToken(user.id, user.email, user.username);

        } catch (error) {
            throw new NotAcceptableException();
        }
    }

    signToken(userId: string, email: string, username: string) {

        const payload = {
            sub: userId,
            email,
            username
        }

        const secret = this.config.get('JWT_SECRET_KEY');

        const token = this.jwt.signAsync(payload, {
            expiresIn: '60m',
            secret
        })

        return { access_token: token, };
    }
}
