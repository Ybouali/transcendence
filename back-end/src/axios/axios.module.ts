import { Module } from '@nestjs/common';
import { AxiosService } from './axios.service';

@Module({
  providers: [AxiosService]
})
export class AxiosModule {}
