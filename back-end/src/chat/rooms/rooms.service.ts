/* eslint-disable prettier/prettier */
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
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

        async kickUserfromRoom(adminId: string, roomId: string, userId: string): Promise<boolean> {
            try {
                const room = await this.prisma.chatRoom.findUnique({
                    where: { id: roomId },
                });
        
                if (!room) {
                    throw new Error('Room does not exist.');
                }
        
                if (room.ownerID === userId) {
                    throw new Error('Cannot kick the owner of the room.');
                }
        
                const isMember = await this.prisma.member.findFirst({
                    where: {
                        userId: userId,
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
        
                await this.prisma.member.deleteMany({
                    where: {
                        userId: userId,
                        chatRoomId: roomId,
                    },
                });

                const wasAdmin = await this.prisma.admins.findFirst({
                    where: {
                        userId: userId,
                        roomId: roomId,
                    },
                });

                if (wasAdmin) {
                    await this.prisma.admins.delete({
                        where: {
                            userId_roomId: {
                                userId: userId,
                                roomId: roomId,
                            },
                        },
                    });
                }
            } catch (error) {
                return false;
            }
            return true;
        }

        async isUserAdmin(userId: string, roomId: string): Promise<boolean> {
            const isAdmin = await this.prisma.admins.findFirst({
                where: {
                    userId,
                    roomId,
                },
            });
        
            return !!isAdmin;
        }

        async removeUserFromRoom(userId: string, roomId: string): Promise<void> {
            await this.prisma.member.deleteMany({
                where: {
                    userId,
                    chatRoomId: roomId,
                },
            });
        }

        async assignNewOwner(userId: string, roomId: string): Promise<void> {
            const oldOwner = await this.prisma.chatRoom.findUnique({
                where: { id: roomId },
                select: { ownerID: true },
            });
        
            const newOwner = await this.prisma.member.findFirst({
                where: {
                    chatRoomId: roomId,
                    userId: { not: oldOwner?.ownerID },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });
            if (oldOwner && oldOwner.ownerID) {
                if (newOwner) {
                    await this.prisma.chatRoom.update({
                        where: { id: roomId },
                        data: {
                            ownerID: newOwner.userId,
                        },
                    });
                }
                    if (newOwner && newOwner.userId) {
                    const isAdmin = await this.prisma.admins.findFirst({
                        where: {
                            userId: newOwner.userId,
                            roomId,
                        },
                    });
            
                    if (!isAdmin) {
                        await this.prisma.admins.create({
                            data: {
                                userId: newOwner.userId,
                                roomId,
                            },
                        });
                    }
                }
            }
        }
        

        async removeUserFromAdmins(userId: string, roomId: string): Promise<void> {
            await this.prisma.admins.deleteMany({
                where: {
                    userId,
                    roomId,
                },
            });
        }

        async getRoomMembersCount(roomId: string): Promise<number> {
            const count = await this.prisma.member.count({
                where: { chatRoomId: roomId },
            });
            return count;
        }

        async deleteRoom(roomId: string): Promise<void> {
            await this.prisma.chatRoom.delete({
                where: { id: roomId },
            });
        }

        async removeUserFromBannedUsers(userId: string, roomId: string): Promise<void> {
            await this.prisma.banedUsers.deleteMany({
                where: {
                    userId,
                    roomId,
                },
            });
        }

        async removeUserFromMutedUsers(userId: string, roomId: string): Promise<void> {
            await this.prisma.mutedUsers.deleteMany({
                where: {
                    userId,
                    roomId,
                },
            });
        }

        async getRoomMembers(roomId: string): Promise<any> {
            const room = await this.prisma.chatRoom.findUnique({
                where: {
                    id: roomId,
                },
                include: {
                    owner: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            avatarUrl: true,
                        },
                    },
                    AdminUsers: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                avatarUrl: true,
                            },
                        },
                    },
                    },
                    members: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                avatarUrl: true,
                            },
                        },
                    },
                    },
                },
                });
            
                if (!room) {
                    return { message: 'Room not found' };
                }
            
                const members = {
                    Owner: [],
                    Admin: [],
                    Member: [],
                };
            
                if (room.owner) {
                    members.Owner.push({
                        id: room.owner.id,
                        username: room.owner.username,
                        email: room.owner.email,
                        avatarUrl: room.owner.avatarUrl,
                    });
                }
            
                room.AdminUsers.forEach((admin) => {
                if (room.owner?.id !== admin.user.id) {
                        members.Admin.push({
                        id: admin.user.id,
                        username: admin.user.username,
                        email: admin.user.email,
                        avatarUrl: admin.user.avatarUrl,
                    });
                }
                });
            
                room.members.forEach((member) => {
                    const isAdmin = room.AdminUsers.some(
                        (admin) => admin.user.id === member.user.id
                    );
                    if (!isAdmin) {
                        members.Member.push({
                        id: member.user.id,
                        username: member.user.username,
                        email: member.user.email,
                        avatarUrl: member.user.avatarUrl,
                        });
                    }
                });
            
                return members;
            }
            
        async  getUserRoleInRoom(userId: string, roomId: string): Promise<string | boolean> {
            const room = await this.prisma.chatRoom.findUnique({
                where: { id: roomId },
                include: {
                    owner: true,
                    members: {
                        where: { userId: userId },
                    },
                    AdminUsers: {
                        where: { userId: userId },
                    },
                },
            });
        
            if (!room) {
                return false;
            }
        
            if (room.ownerID === userId) {
                return 'Owner';
            }
        
            if (room.AdminUsers.length > 0) {
                return 'Admin';
            }
        
            if (room.members.length > 0) {
                return 'Member';
            }
        
            return false;
        }
        

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        async kickUserfromRoomHTTP(adminId: string, roomId: string, userId: string): Promise<any> {
                const room = await this.prisma.chatRoom.findUnique({
                    where: { id: roomId },
                });
        
                if (!room) {
                    throw new NotFoundException('Room does not exist.');
                }
        
                if (room.ownerID === userId) {
                    throw new BadRequestException('Cannot kick the owner of the room.');
                }
        
                const isMember = await this.prisma.member.findFirst({
                    where: {
                        userId: userId,
                        chatRoomId: roomId,
                    },
                });
        
                if (!isMember) {
                    throw new BadRequestException('User is not a member of this room.');
                }
        
                const isAdmin = await this.prisma.admins.findFirst({
                    where: {
                        userId: adminId,
                        roomId: roomId,
                    },
                });
        
                if (!isAdmin) {
                    throw new BadRequestException('You are not an admin in this room.');
                }
        
                await this.prisma.member.deleteMany({
                    where: {
                        userId: userId,
                        chatRoomId: roomId,
                    },
                });

                const wasAdmin = await this.prisma.admins.findFirst({
                    where: {
                        userId: userId,
                        roomId: roomId,
                    },
                });

                if (wasAdmin) {
                    await this.prisma.admins.delete({
                        where: {
                            userId_roomId: {
                                userId: userId,
                                roomId: roomId,
                            },
                        },
                    });
                }
        }


        async banUserInRoomHTTP(adminId: string, roomId: string, bannedId: string): Promise<any> {
                const room = await this.prisma.chatRoom.findUnique({
                    where: { id: roomId },
                });
        
                if (!room) {
                    throw new NotFoundException('Room does not exist.');
                }
        
                if (room.ownerID === bannedId) {
                    throw new BadRequestException('Cannot ban the owner of the room.');
                }
        
                const isMember = await this.prisma.member.findFirst({
                    where: {
                        userId: bannedId,
                        chatRoomId: roomId,
                    },
                });
        
                if (!isMember) {
                    throw new BadRequestException('User is not a member of this room.');
                }
        
                const isAdmin = await this.prisma.admins.findFirst({
                    where: {
                        userId: adminId,
                        roomId: roomId,
                    },
                });
        
                if (!isAdmin) {
                    throw new BadRequestException('You are not an admin in this room.');
                }
        
                await this.prisma.banedUsers.create({
                    data: {
                        userId: bannedId,
                        roomId: roomId,
                    },
                });
        }
}