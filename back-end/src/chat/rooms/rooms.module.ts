/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Module({
    exports: [RoomsService],
    providers: [
        RoomsService,
    ],
})
export class RoomsModule {}