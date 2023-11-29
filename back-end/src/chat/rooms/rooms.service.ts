/* eslint-disable prettier/prettier */
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { Injectable } from "@nestjs/common";


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
}