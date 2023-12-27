/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { FriendshipDto } from "./dto/friendship.dto";


@Injectable()
export class FriendService{
    constructor(private readonly prisma: PrismaService){}
    async getAllFriends(userId: string) {
        const userFriends = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    { userOne: userId },
                    { userTwo: userId },
                ],
            },
        });

        const friendIds = userFriends.map(friendship => {
            return friendship.userOne === userId ? friendship.userTwo : friendship.userOne;
        });

        const friends = await this.prisma.user.findMany({
            where: {
                id: {
                    in: friendIds,
                },
            },
            select: {
                id: true,
                username: true,
                avatarUrl:true
            },
        });

        return friends;
    }

    async addFriend(userId: string, friendId: string): Promise<FriendshipDto | { error: string }> {
        try {
            const friendship = await this.prisma.friendship.create({
                data: {
                userOne: userId,
                userTwo: friendId,
                },
            });
        
            return {
                id: friendship.id,
                userOneId: friendship.userOne,
                userTwoId: friendship.userTwo,
            };
        } catch (error) {
            return { error: error.message };
        }
    }

}