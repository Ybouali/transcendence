/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { MessagesService } from "./DirectMessages/messages.service";
import { MessagesModule } from "./DirectMessages/messages.module";


@Module({
    imports: [MessagesModule],
    providers: [ChatService, ChatGateway, MessagesService],
})
export class ChatModule {}