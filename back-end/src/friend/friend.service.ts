/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";


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
}
