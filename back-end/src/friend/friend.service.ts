/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
// import { FriendshipDto } from "./dto/friendship.dto";


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
                Status: true,
                username: true,
                avatarUrl:true
            },
        });

        const newFriends = friends.map(item => ({
            id: item.id,
            name: item.username,
            status: item.Status,
            images: [
                item.avatarUrl
            ]
        }))

        return {
            friends: [
                ...newFriends
            ]
        };
    }

    // async addFriend(userId: string, friendId: string): Promise<FriendshipDto | { error: string }> {
    //     try {
    //         const friendship = await this.prisma.friendship.create({
    //             data: {
    //             userOne: userId,
    //             userTwo: friendId,
    //             },
    //         });
        
    //         return {
    //             id: friendship.id,
    //             userOneId: friendship.userOne,
    //             userTwoId: friendship.userTwo,
    //         };
    //     } catch (error) {
    //         return { error: error.message };
    //     }
    // }

    async blockFriend(userId: string, friendId: string): Promise<boolean> {
        try {
                const friendship = await this.prisma.friendship.findFirst({
                    where: {
                        OR: [
                            { userOne: userId, userTwo: friendId },
                            { userOne: friendId, userTwo: userId }, 
                        ],
                    },
                });
                if (!friendship) {
                    throw new Error('Friendship not found.');
                }
                await this.prisma.friendship.delete({ where: { id: friendship.id } });
                await this.prisma.blockedUsers.create({
                    data: {
                        blockingId: userId,
                        blockedId: friendId,
                    },
                });
                return true;
        } catch (error) {
                console.error('Error blocking user:', error.message);
                throw new Error;
        }
    }

    async unblockFriend(userId: string, friendId: string): Promise<boolean> {
            try {
                await this.prisma.blockedUsers.deleteMany({
                    where: {
                        blockingId: userId,
                        blockedId: friendId,
                    },
                });
                await this.prisma.friendship.create({
                    data: {
                    userOne: userId,
                    userTwo: friendId,
                    },
                });
        
                return true;
            } catch (error) {
                console.error('Error unblocking friend:', error.message);
                return false;
            }
    }

    async getBlockedFriends(userId: string) {
        try {
            const blockedUsers = await this.prisma.blockedUsers.findMany({
                where: {
                    blockingId: userId,
                },
                include: {
                    blockedUser: {
                        select: {
                            id: true,
                            username: true,
                            avatarUrl: true,
                        },
                    },
                },
            });

            return blockedUsers.map(({ blockedUser }) => blockedUser);
        } catch (error) {
            return { error: error.message };
        }
    }

    async addFriend(userId: string, friendId: string) {
        try {
            await this.prisma.friendship.create({
                data: {
                userOne: userId,
                userTwo: friendId,
                },
            });
        } catch (error) {
            throw { error: error.message };
        }
    }
}