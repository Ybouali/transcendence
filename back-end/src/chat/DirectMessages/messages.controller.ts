/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { ConversationDto } from "./dto/conversation.dto";
import { DirectMessageDto } from "./dto/direct-message.dto";

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}


    @Get('conversation/me/:userId')
    async getConversation(
        @Param('userId') userId: string,
    ): Promise<ConversationDto[]> {
        const conversation = await this.messagesService.getConversation(userId);
        return conversation;
    }

    @Get('conversation/:user1Id/:user2Id')
    async getMessagesBetweenUsers(
        @Param('user1Id') user1Id: string,
        @Param('user2Id') user2Id: string,
    ): Promise<DirectMessageDto[]> {
        return this.messagesService.getMessagesBetweenUsers(user1Id, user2Id);
    }
}