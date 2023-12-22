/* eslint-disable prettier/prettier */
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { Injectable } from "@nestjs/common";
import { ChatRoom, Member, MutedUsers } from "@prisma/client";
import { RoomDto } from "./dto/room-conv.dto";
import { RoomMessageDto } from "./dto/room-message.dto";
import { CreateMessageDto } from "./dto/create-message.dto";


@Injectable()
export class RoomsService {
    constructor(
        private prisma: PrismaService, 
        ) {}


    async createRoom(createRoomDto: CreateRoomDto){
        try {
            return await this.prisma.chatRoom.create({
                data: {
                    image: createRoomDto.image,
                    isProtected: createRoomDto.isProtected,
                    roomName: createRoomDto.roomName,
                    roomType: createRoomDto.roomType,
                    password: createRoomDto.password,
                    owner: {
                        connect: { id: createRoomDto.ownerID }, // Connect the room to the owner
                    },
                },

            });
        } catch (error) {
            console.error('Error creating room:', error);
            throw new Error('Failed to create room');
        }
    }

    async addUserToRoom(roomId: string, userId: string) {
        const existingMember = await this.prisma.member.findFirst({
            where: {
                userId,
                chatRoomId: roomId,
            },
        });

        if (!existingMember) {
            await this.prisma.member.create({
                data: {
                    userId,
                    chatRoomId: roomId,
                },
            });
        }
        return;
    }

    async addUserAsAdmin(roomId: string, userId: string) {
        try {
            const adminEntry = await this.prisma.admins.create({
                data: {
                    userId: userId,
                    roomId: roomId,
                },
            });
            return adminEntry;
        } catch (error) {
            throw new Error(`Failed to add user as admin: ${error.message}`);
        }
    }

    async findRoomById(roomId: string) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: roomId
            }
        });
        return room;
    }

    async updateRoomPassword(roomId: string, newPassword: string): Promise<boolean> {
        try {
            // hash password
            const nPass = newPassword;
            const updatedRoom = await this.prisma.chatRoom.update({
                where: { id: roomId },
                data: { password: nPass },
            });
    
            if (updatedRoom) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error updating room password:', error);
            return false;
        }
    }

    async updateRoom(roomId: string, updatedFields: Partial<ChatRoom>) {
        try {
            const updatedRoom = await this.prisma.chatRoom.update({
                where: { id: roomId },
                data: updatedFields,
            });
            return updatedRoom;
        } catch (error) {
            throw new Error(`Error updating room: ${error}`);
        }
    }

    async getRoomsForUser(userId: string): Promise<RoomDto[]> {
        const userRooms = await this.prisma.member.findMany({
            where: {
                userId: userId,
            },
            include: {
                chatRoom: true,
            },
        });
        const rooms: RoomDto[] = userRooms.map((userRoom) => {
            return {
                id: userRoom.chatRoom.id,
                roomName: userRoom.chatRoom.roomName,
                roomType: userRoom.chatRoom.roomType,
                image: userRoom.chatRoom.image,
            };
        });
    
        return rooms;
    }
    

    async getMessagesForRoom(roomId: string): Promise<RoomMessageDto[]> {
        const roomMessages = await this.prisma.roomMessage.findMany({
            where: {
                roomId: roomId,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
                room: {
                    select: {
                        id: true,
                        roomName: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    
        const formattedMessages: RoomMessageDto[] = roomMessages.map((message) => {
            return {
                roomId: message.roomId,
                createdAt: message.createdAt,
                message: message.message,
                sender: {
                    id: message.sender.id,
                    username: message.sender.username,
                },
                room: {
                    id: message.room.id,
                    roomName: message.room.roomName,
                },
            };
        });
    
        return formattedMessages;
    }

    async banUserInRoom(adminId: string, roomId: string, bannedId: string): Promise<boolean> {
        try {
            const room = await this.prisma.chatRoom.findUnique({
                where: { id: roomId },
            });
    
            if (!room) {
                throw new Error('Room does not exist.');
            }
    
            if (room.ownerID === bannedId) {
                throw new Error('Cannot ban the owner of the room.');
            }
    
            const isMember = await this.prisma.member.findFirst({
                where: {
                    userId: bannedId,
                    chatRoomId: roomId,
                },
            });
    
            if (!isMember) {
                throw new Error('User is not a member of this room.');
            }
    
            const isAdmin = await this.prisma.admins.findFirst({
                where: {
                    userId: adminId,
                    roomId: roomId,
                },
            });
    
            if (!isAdmin) {
                throw new Error('You are not an admin in this room.');
            }
    
            await this.prisma.banedUsers.create({
                data: {
                    userId: bannedId,
                    roomId: roomId,
                },
            });
        } catch (error) {
            return false;
        }
        return true;
    }

    async isRoomOwner(userId: string, roomId: string): Promise<boolean> {
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: roomId },
            include: { owner: true },
        });
    
        return room?.owner.id === userId;
    }

    async addAdminToRoom(ownerId: string, roomId: string, adminId: string): Promise<void> {
        try {
            const isOwner = await this.isRoomOwner(ownerId, roomId);
            if (isOwner) {
                await this.prisma.admins.create({
                    data: {
                        userId: adminId,
                        roomId: roomId,
                    },
                });
            } else {
                throw new Error('You are not the owner of this room.');
            }
            } catch (error) {
                console.log('??????');
            }
        }
    
        async getBanedUsers(roomId: string) {
            return await this.prisma.banedUsers.findMany({
                where: {
                    roomId: roomId,
                },
            });
        }

        async getAllMembersOfRoom(roomId: string): Promise<Member[]> {
            return this.prisma.member.findMany({
                where: {
                    chatRoomId: roomId,
                },
            });
        }

        async checkMutedUser(senderId: string, roomId: string): Promise<MutedUsers | null> {
            const mutedUser = await this.prisma.mutedUsers.findFirst({
                where: {
                    userId: senderId,
                    roomId: roomId,
                },
            });
    
            return mutedUser;
        }

        async isUserBanned(senderId: string, roomId: string) {
            const bannedUsers = await this.prisma.banedUsers.findMany({
                where: {
                    roomId: roomId,
                    userId: senderId,
                },
            });
        
            return bannedUsers.length > 0;
        }

        async createMessage(createMessageDto: CreateMessageDto) {
            return this.prisma.roomMessage.create({
                data: {
                    message: createMessageDto.message,
                    senderId: createMessageDto.senderId,
                    roomId: createMessageDto.receiverId,
                }
            });
        }
}