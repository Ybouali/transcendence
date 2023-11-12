import { JwtService } from '@nestjs/jwt';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TowFactorAuthModule } from './tow-factor-auth/tow-factor-auth.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TowFactorAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private appService: AppService) {}

  onApplicationBootstrap() {
    this.appService.init_server();
  }
}
