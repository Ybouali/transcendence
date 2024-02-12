import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshStrategy, AccessStrategy, LocalStrategy } from './strategy';
import { UserService } from 'src/user/user.service';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    AccessStrategy,
    RefreshStrategy,
    LocalStrategy,
    UserService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
