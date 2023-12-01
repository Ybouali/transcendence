/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { ConversationDto } from "./dto/conversation.dto";

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}


    @Get('conversation/:userId')
    async getConversation(
        @Param('userId') userId: string,
    ): Promise<ConversationDto[]> {
        const conversation = await this.messagesService.getConversation(userId);
        return conversation;
    }
}