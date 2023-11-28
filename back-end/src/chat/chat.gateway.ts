/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { CreateMessageDto } from './DirectMessages/dto/create-message.dto';
import { MessagesService } from './DirectMessages/messages.service';
import { ChatService } from './chat.service';
import { SharedService } from './shared/shared.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/chat'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private             logger = new Logger(ChatGateway.name);
    @WebSocketServer()  server: Server;

    constructor (
        private messageService: MessagesService,
        private chatService: ChatService,
        private prisma: PrismaService,
    ) {}

    handleDisconnect(client: any) {
        // [test]
        const userId = client.handshake.headers.authorization;

        this.chatService.removeUserSocket(userId, client.id);
        this.logger.debug('onDisconnect ', client.id);
    }

    handleConnection(client: any) {
        // [test]
        const userId = client.handshake.headers.authorization;

        this.chatService.addUserSocket(userId, client.id);
        this.logger.debug('onConnection: ', client.id);
    }

    @SubscribeMessage('sendMessage')
    async createMessage(client: Socket, createMessageDto: CreateMessageDto) {
            // [test]
            const userId = client.handshake.headers.authorization;

            if (userId !== createMessageDto.senderId || createMessageDto.message.length > 150) return;
            if (createMessageDto.isRoom === false) {
                const isBlocked = await this.messageService.isBlocked(createMessageDto.receiverId, createMessageDto.senderId);
                if (isBlocked) {
                    this.server.to(client.id).emit('newMessage', { code: 404, message: 'The receiver has blocked you.' });
                    return;
                }
                await this.messageService.createMessage(createMessageDto);
                const recvSockets = SharedService.UsersSockets.get( createMessageDto.receiverId );
                let destUserSockets = [ ...SharedService.UsersSockets.get(createMessageDto.senderId), ];
                if (recvSockets)
                    destUserSockets = [...destUserSockets, ...recvSockets];
                destUserSockets.forEach((socket) => {
                this.server.to(socket).emit('newMessage', { code: 200, ...createMessageDto });
            });
        }
    }
}