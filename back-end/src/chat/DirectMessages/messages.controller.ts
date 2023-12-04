/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { ConversationDto } from "./dto/conversation.dto";
import { DirectMessageDto } from "./dto/direct-message.dto";
import { CreateMessageDto } from "./dto/create-message.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService,
        private eventEmitter: EventEmitter2
        ) {}


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

    @Post('sendHi/:userId')
    async createHiMessage(
        @Param('userId') userId: string,
        @Body() createMessageDto: CreateMessageDto
    ): Promise<void> {
        this.eventEmitter.emit('sendHi', createMessageDto);
    }
}