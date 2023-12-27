/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MatchModule } from './match/match.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [
    FriendModule,
    PrismaModule,
    MatchModule,
    ChatModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
