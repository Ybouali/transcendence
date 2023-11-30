/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { CreateMessageDto } from './DirectMessages/dto/create-message.dto';
import { MessagesService } from './DirectMessages/messages.service';
import { ChatService } from './chat.service';
import { SharedService } from './shared/shared.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './rooms/dto/create-room.dto';
import { RoomsService } from './rooms/rooms.service';

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
        private roomsService: RoomsService,
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

    @SubscribeMessage('sendMESSAGE')
    async createMessage(client: Socket, createMessageDto: CreateMessageDto) {
        try 
        {
            // [test]
            const userId = client.handshake.headers.authorization;

            if (userId !== createMessageDto.senderId || createMessageDto.message.length > 150) return;
            if (createMessageDto.isRoom === false) {
                    const isBlocked = await this.messageService.isBlocked(createMessageDto.receiverId, createMessageDto.senderId);
                    if (isBlocked) {
                        this.server.to(client.id).emit('newMESSAGE', { code: 404, message: 'The receiver has blocked you.' });
                        return;
                    }
                    await this.messageService.createMessage(createMessageDto);
                    const recvSockets = SharedService.UsersSockets.get( createMessageDto.receiverId );
                    let destUserSockets = [ ...SharedService.UsersSockets.get(createMessageDto.senderId), ];
                    if (recvSockets)
                        destUserSockets = [...destUserSockets, ...recvSockets];
                    destUserSockets.forEach((socket) => {
                    this.server.to(socket).emit('newMESSAGE', { code: 200, ...createMessageDto });
                });
            }
        }
        catch (error){
            // [test]
            this.logger.error('failure in message creation');
            this.server.to(client.id).emit('newMessage', { code: 500, message: 'server: there is an error.' });
        }
    }

    @SubscribeMessage('createROOM')
    async createRoom ( @ConnectedSocket() client: Socket, @MessageBody() createRoom: CreateRoomDto) {
            try {            
                let newRoom;
                const roomType = (createRoom.roomType === 'Private' ? 'Private' : 'Public');
                if (createRoom.isProtected){
                    // hash the Password
                } else {
                    newRoom = await this.roomsService.createRoom({...createRoom, roomType});
                }
                if (newRoom) {
                    await this.roomsService.addUserToRoom(newRoom.id, createRoom.ownerID);  // Add owner to Members table
                    await this.roomsService.addUserAsAdmin(newRoom.id, createRoom.ownerID); // Add owner to Admins table
                    client.join(newRoom.id);
                    this.server.emit('roomsUPDATED');
                } else {
                    client.emit('roomERROR', { message: 'Failed to create room' });
                }
            } catch (error) {
                client.emit('roomERROR', { message: 'Failed to create room' });
            }
    }

    @SubscribeMessage('joinROOM')
    async joinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() newMember: { userId: string; roomId: string }
    ) {
        try {
            const room = await this.roomsService.findRoomById(newMember.roomId);
            if (!room) {
                throw new Error('Room not found');
            }
            client.join(newMember.roomId);
            await this.roomsService.addUserToRoom(newMember.roomId, newMember.userId);
            const memberSockets = SharedService.UsersSockets.get(newMember.userId);
            memberSockets?.forEach((socket) => { this.server.to(socket).emit('roomsUPDATED'); });
        } catch (error) {
            console.error('Error joining room:', error.message);
            client.emit('roomERROR', { message: error.message });
        }
    }

    @SubscribeMessage('setPASSWORD')
    async setPassword(
        @MessageBody() room: { adminId: string; roomId: string; password: string },
    ) {
        const findRoom = await this.roomsService.findRoomById(room.roomId);
        if (findRoom.ownerID === room.adminId) {
            await this.roomsService.updateRoomPassword(
                room.roomId,
                room.password,
            );
            this.server.emit('roomsUPDATED');
        }
    }

    @SubscribeMessage('removePASSWORD')
    async removePassword(
        @MessageBody() room: { adminId: string; roomId: string },
    ) {
        const findRoom = await this.roomsService.findRoomById(room.roomId);
        if (findRoom.ownerID === room.adminId) {
            const password = null;
            const updatedFields = {
                isProtected: false,
                password: password,
            };
            await this.roomsService.updateRoom(room.roomId, updatedFields);
            this.server.emit('roomsUPDATED');
        }
    }
}