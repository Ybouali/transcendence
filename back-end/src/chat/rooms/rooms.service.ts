/* eslint-disable prettier/prettier */
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { Injectable } from "@nestjs/common";
import { ChatRoom } from "@prisma/client";
import { RoomDto } from "./dto/room-conv.dto";
import { RoomMessageDto } from "./dto/room-message.dto";


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
    
}