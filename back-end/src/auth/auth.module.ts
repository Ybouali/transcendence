import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshStrategy, AccessStrategy } from './strategy';
import { EncryptionService } from 'src/encryption/encryption.service';
import { UserService } from 'src/user/user.service';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    AccessStrategy,
    RefreshStrategy,
    EncryptionService,
    UserService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
