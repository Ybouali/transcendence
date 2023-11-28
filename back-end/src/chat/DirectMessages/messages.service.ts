/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";


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
}