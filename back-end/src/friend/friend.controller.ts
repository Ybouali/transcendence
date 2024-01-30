/* eslint-disable prettier/prettier */

import { Controller, Get, Param, Post } from "@nestjs/common";
import { FriendService } from "./friend.service";
import { EventEmitter2 } from "@nestjs/event-emitter";



@Controller('friend')
export class FriendController{
    constructor(private readonly friendService: FriendService,
        private eventEmitter: EventEmitter2) {}

    // :userId for test
    @Get('all/:userId')
    async getAllFriends(@Param('userId') userId: string) {
        return await this.friendService.getAllFriends(userId);
    }

    // :userId for test
    @Post(':userId/add/:friendId')
    async addFriend(@Param('userId') userId: string, @Param('friendId') friendId: string) {
        try {
            this.eventEmitter.emit('addFriend', {userId, friendId});
        } catch (error) {
            console.log('errrrrrrrrrrror');
            throw error;
        }
    }

    // :userId for test
    @Post(':userId/block/:friendId')
    async blockFriend(@Param('userId') userId: string, @Param('friendId') friendId: string) {
        try {
            const blocked = await this.friendService.blockFriend(userId, friendId);
            if (blocked) {
                return { message: 'User blocked successfully.' };
            } else {
                return { error: 'Failed to block the user.' };
            }
        } catch (error) {
                return { error: 'Failed to block the user.' };
        }
    }

    // :userId for test
    @Post(':userId/unblock/:friendId')
    async unblockFriend(@Param('userId') userId: string, @Param('friendId') friendId: string) {
        try {
            const unblocked = await this.friendService.unblockFriend(userId, friendId);
            if (unblocked) {
                return { message: 'User unblocked successfully.' };
            } else {
                return { error: 'Failed to unblock the user.' };
            }
        } catch (error) {
                return { error: 'Failed to unblock the user.' };
        }
    }

    // :userId for test
    @Get('blocked/:userId')
    async getBlockedFriends(@Param('userId') userId: string) {
        return await this.friendService.getBlockedFriends(userId);
        
    }
}