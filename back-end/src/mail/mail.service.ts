import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendEmailConfirmation(userId: string, name: string, email: string) {
        const url = `http://test.com/${userId}`;

        console.log('Sent email confirmation 1');
        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to Nice App! Confirm your Email',
            template: './confirmation',
            context: {
                name,
                url
            }
        })
        console.log('Sent email confirmation 2');
    }
}
