import { MailService } from './../mail/mail.service';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private mailService: MailService) {}

    async signupWithEmail (dto: AuthDto) {

        // send the email to validate the email address
        try {
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

            console.log('hello from 1');

            await this.mailService.sendEmailConfirmation(user.id, user.username, user.email);
            
            console.log('hello from 2');

            return user;
        } catch (error) {
            console.log(error)
            throw new NotAcceptableException();
        }

        

        return 'error';
    }

    // signin (dto: AuthDto) {}
}
