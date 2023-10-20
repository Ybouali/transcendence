import { MailService } from './../mail/mail.service';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private mailService: MailService) {}

    async signupWithEmail (dto: AuthDto) {

        // store the user into db
        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                verifiedEmail: false,
                password: dto.password,
                avatarUrl: 'https://pics.freeicons.io/uploads/icons/png/16671574911586787867-512.png',
                Status: true,
                twoFactor: false
            }
        });

        // send the email to validate the email address
        try {
            await this.mailService.sendEmailConfirmation(user.id, user.username, user.email);
        } catch (error) {
            console.log(error)
            throw new NotAcceptableException();
        }

        

        return user;
    }

    // signin (dto: AuthDto) {}
}
