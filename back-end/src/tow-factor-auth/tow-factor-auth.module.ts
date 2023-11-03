import { Module } from '@nestjs/common';
import { TowFactorAuthController } from './tow-factor-auth.controller';
import { TowFactorAuthService } from './tow-factor-auth.service';

@Module({
  controllers: [TowFactorAuthController],
  providers: [TowFactorAuthService]
})
export class TowFactorAuthModule {}
