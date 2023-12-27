/* eslint-disable prettier/prettier */

import { Controller, Get, Param } from "@nestjs/common";
import { FriendService } from "./friend.service";



@Controller('friend')
export class FriendController{
    constructor(private readonly friendService: FriendService) {}

    // :userId for test
    @Get('all/:userId')
    async getAllFriends(@Param('userId') userId: string) {
        return await this.friendService.getAllFriends(userId);
    }
}