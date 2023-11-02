/* eslint-disable prettier/prettier */

import { IsDateString, IsNumber, IsUUID } from "class-validator";


export class CreateMatchDto {
    @IsUUID()
    userId1: string;
    @IsUUID()
    userId2: string;
    @IsUUID()
    winnerId: string;
    @IsDateString()
    startTimeGame: string;
    @IsDateString()
    endTimeGame: string;
    @IsNumber()
    scoreUser1: number;
    @IsNumber()
    scoreUser2: number;
}