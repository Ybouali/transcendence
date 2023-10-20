import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'transcendence.com',
        secure: false,
        auth: {
          user: 'yassine.bouali.bo@gmail.com',
          pass: '19@NoOne@96'
        },
      },
      defaults: {
        from: '"No Reply" <noreply@gmail.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
