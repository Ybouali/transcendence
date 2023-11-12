import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RefreshStrategy, AccessStrategy } from './strategy';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, AccessStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
