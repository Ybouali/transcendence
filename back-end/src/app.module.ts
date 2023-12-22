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
import { EncryptionService } from './encryption/encryption.service';
import { EncryptionModule } from './encryption/encryption.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env_back-end'
    }),
    TowFactorAuthModule,
    EncryptionModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, EncryptionService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private appService: AppService) {}

  onApplicationBootstrap() {
    this.appService.init_server();
  }
}
