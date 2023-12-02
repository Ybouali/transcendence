/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ConversationDto } from "./dto/conversation.dto";
import { User } from "@prisma/client";
import { DirectMessageDto } from "./dto/direct-message.dto";

@Injectable()
export class MessagesService {
    constructor (private prisma: PrismaService) {}

    async createMessage(createMessageDto: CreateMessageDto) {
        return this.prisma.directMessage.create({
            data: {
                message: createMessageDto.message,
                senderId: createMessageDto.senderId,
                receiverId: createMessageDto.receiverId,
                readed: false
            }
        });
    }

    async isBlocked(blockingId: string, blockedId: string): Promise<boolean> {
        const isBlocked = await this.prisma.blockedUsers.findFirst({
            where: {
                OR: [
                    { blockingId, blockedId },
                    { blockingId: blockedId, blockedId: blockingId },
                ],
            },
        });    
        return !!isBlocked;
    }

    async getConversation(userId: string): Promise<ConversationDto[]> {
        const conversation = await this.prisma.directMessage.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            include: {
                sender: true,
                receiver: true,
            },
        });

        const usersMap = new Map<string, User>();

        conversation.forEach((message) => {
            const senderId = message.senderId;
            const receiverId = message.receiverId;

            if (senderId !== userId && !usersMap.has(senderId)) {
                usersMap.set(senderId, message.sender);
            } else if (receiverId !== userId && !usersMap.has(receiverId)) {
                usersMap.set(receiverId, message.receiver);
            }
        });

        const uniqueUsersConversation: ConversationDto[] = Array.from(usersMap.values()).map((user) => {
            return {
                user: {
                    email: user.email,
                    username: user.username,
                    avatarUrl: user.avatarUrl,
                    id: user.id
                },
            };
        });

        return uniqueUsersConversation;
    }

    async getMessagesBetweenUsers(user1Id: string, user2Id: string): Promise<DirectMessageDto[]> {
        const messages = await this.prisma.directMessage.findMany({
            where: {
                OR: [
                    { AND: [{ senderId: user1Id }, { receiverId: user2Id }] },
                    { AND: [{ senderId: user2Id }, { receiverId: user1Id }] },
                ],
            },
            orderBy: {
                createdAt: 'asc',
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
    
        const formattedMessages: DirectMessageDto[] = messages.map((message) => {
            return {
                id: message.id,
                createdAt: message.createdAt,
                message: message.message,
                sender: {
                    id: message.sender.id,
                    username: message.sender.username,
                    avatarUrl: message.sender.avatarUrl,
                },
                receiver: {
                    id: message.receiver.id,
                    username: message.receiver.username,
                },
            };
        });
    
        return formattedMessages;
    }
    
}