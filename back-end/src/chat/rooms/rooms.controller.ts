/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards, Delete} from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { RoomDto } from "./dto/room-conv.dto";
import { RoomMessageDto } from "./dto/room-message.dto";
// import { error } from "console";
import { RolesGuard } from "./guards/roles.guard";
import { Role } from "./guards/role.enum";
import { Roles } from "./guards/roles";
import { CreateRoomDto } from "./dto/create-room.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Controller('room')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService,
        private eventEmitter: EventEmitter2) {}

    @Get('search/:que')
    async getSearchResults(@Param('que') que: string,): Promise<any> {
        try {
            return this.roomsService.getSearchResults(que);
        } catch (error) {
            throw error;
        }
    }

    // userId for test
    @Get('all/conv/:userId')
    async getRoomsForUser(@Param('userId') userId: string): Promise<RoomDto[]> {
        return this.roomsService.getRoomsForUser(userId);
    }

    @Get('all/:userId')
    async getAllRoomsForUser(@Param('userId') userId: string): Promise<RoomDto[]> {
        console.log('all rooms')
        return this.roomsService.getAllRoomsForUser(userId);
    }

    @Get('/:userId/:roomId')
    async getRoomInfo(@Param('userId') userId: string, @Param('roomId') roomId: string): Promise<RoomDto[]> {
        return this.roomsService.getRoomInfo(roomId, userId);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Owner)
    @Post(':userId/:roomId/kick')
    async kickMember(@Param('userId') userId: string ,@Body() room1: { adminId: string; roomId: string; userId: string })
    {
        console.log('fucking kick')
        try {
            const infoUser = await this.roomsService.getUserInfo(room1.userId);
            const eventName = await this.roomsService.kickUserfromRoomHTTP(room1.adminId, room1.roomId, room1.userId);
            // this.eventEmitter.emit('kickMember', {roomId: room1.roomId, userId: room1.userId});
            this.eventEmitter.emit('roomUpdate', {roomId: room1.roomId, userId: room1.userId, eventName: 'leaveRoom', adminId: room1.adminId});
            console.log('everythings okay')
            return {...infoUser, role: (eventName === 'removeMember' ? 'members' : 'admins')};
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Owner)
    @Post(':userId/:roomId/accept')
    async acceptRequest(@Param('userId') userId: string ,@Body() room1: { adminId: string; roomId: string; userTwo: string })
    {
        console.log('accept request')
        try {
            const infoUser = await this.roomsService.getUserInfo(room1.userTwo);
            await this.roomsService.AcceptRequestRoomHTTP(room1.adminId, room1.roomId, room1.userTwo);
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name,
            }
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Owner)
    @Post(':userId/:roomId/decline')
    async declineRequest(@Param('userId') userId: string ,@Body() room1: { adminId: string; roomId: string; userTwo: string })
    {
        console.log('accept request')
        try {
            const infoUser = await this.roomsService.getUserInfo(room1.userTwo);
            await this.roomsService.declineRequestRoomHTTP(room1.adminId, room1.roomId, room1.userTwo);
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name,
            }
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Owner)
    @Delete('/:userId/:roomId/delete')
    async removeRoom(@Body() room: { roomId: string }): Promise<any> {
        try{
            const membersIds = await this.roomsService.removeRoom(room.roomId);
            this.eventEmitter.emit('deleteRoom', room.roomId, membersIds);
            return true
        } catch (error) {
            throw error
        }
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Owner, Role.Admin, Role.Member)
    @Post(':userId/:roomId/leaveROOM')
    async leaveRoom(@Body() data: { userId: string, roomId: string }): Promise<void> {
        try {
            console.log(data)
            await this.roomsService.leaveRoomHTTP(data);
            this.eventEmitter.emit('roomUpdate', {
                roomId: data.roomId, 
                userId: data.userId, 
                eventName: 'leaveRoom', 
                adminId: undefined
            });
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Owner)
    @Post(':userId/:roomId/updateRoom')
    async updateRoom(@Param('roomId') roomId: string,@Body() updateRoom: {roomName: string, password: string, roomType: string, admins: string[]}) {
        try {
            console.log(updateRoom)
            return await this.roomsService.updateRoomHTTP(roomId, updateRoom);
        } catch (error) {
            throw error;
        }
	}

    @Get('messages/:userId/:roomId')
    async getMessagesForRoom(
        @Param('roomId') roomId: string, @Param('userId')userId
    ): Promise<RoomMessageDto[]> {
        const response = await this.roomsService.getMessagesInRoom(roomId, userId);
        console.log(response);
        return response;
    }

    @Get(':userId/:roomId/members')
    async getRoomMembers(@Param('userId') userId: string, @Param('roomId') roomId: string): Promise<any> {
        return this.roomsService.getRoomMembers(roomId);
    }

    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin, Role.Owner)
    // @Post(':userId/:roomId/:addedUserId/add')
    // async addMember(@Param('userId') userId: string,@Param('roomId') roomId: string, @Param('addedUserId') addedUserId: string)
    // {
    //     try {
    //         const room = await this.roomsService.findRoomById(roomId);
    //         if (!room) {
    //             throw new NotFoundException('Room not found');
    //         }
    //         await this.roomsService.addUserToRoom(roomId, addedUserId);
    //     } catch (error) {
    //         if (error instanceof NotFoundException) {
    //             throw error;
    //         }
    //         throw new InternalServerErrorException('Internal server error');
    //     }
    // }

    

    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Owner)
    @Post(':userId/:roomId/ban')
    async banMember(@Param('userId') userId: string ,@Body() room1: { adminId: string; roomId: string; bannedId: string })
    {
        try {
            console.log('ban user here')
            const infoUser = await this.roomsService.getUserInfo(room1.bannedId);
            console.log(infoUser)
            await  this.roomsService.banUserInRoomHTTP(room1.adminId, room1.roomId, room1.bannedId);
            this.eventEmitter.emit('roomUpdate', {
                roomId: room1.roomId, 
                userId: room1.bannedId, 
                eventName: 'leaveRoom', 
                adminId: undefined
            });
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Owner)
    @Post(':userId/:roomId/unban')
    async unbanMember(@Param('userId') userId: string ,@Body() room1: { adminId: string; roomId: string; unbannedId: string })
    {
        try {
            console.log('hello we are here merci', room1)
            const infoUser = await this.roomsService.getUserInfo(room1.unbannedId);
            console.log(infoUser)
            const role = await  this.roomsService.unbanUserInRoomHTTP(room1.adminId, room1.roomId, room1.unbannedId);
            const images = await this.roomsService.getImagesOfRoom(room1?.roomId);
            const newRoom = await this.roomsService.getInfosOfRoom(room1?.roomId);
            this.eventEmitter.emit('addRoom', {newRoom, ownerID: room1.unbannedId, images});
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name,
                role
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Owner)
    @Post(':userId/:roomId/setAdmin')
	async setAdminToRoom(@Body() room: { adminId: string; roomId: string; newAdmin: string }) {
        try {
            const infoUser = await this.roomsService.getUserInfo(room.newAdmin);
            await this.roomsService.addAdminToRoomHTTP(room.adminId, room.roomId, room.newAdmin);
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name
            };
        } catch (error) {
            throw error;
        }
    }

    

    @Get('/getAllPublicRooms')
    async getAllPublicRooms(): Promise<any> {
        try {
            return this.roomsService.getAllPublicRooms();
        } catch (error) {
            throw error;
        }
    }

    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @Post('/joinRoom')
    async joinRoom(@Body() data: { userId: string, roomId: string, password: string }): Promise<any> {
        try {
            console.log('Handle join Room');
            const newRoom = await this.roomsService.joinRoomHTTP(data);
            const images = await this.roomsService.getImagesOfRoom(newRoom?.id);
            if (newRoom.roomType !== 'private'){
                this.eventEmitter.emit('addRoom', {newRoom, ownerID: data.userId, images});
            }
            return newRoom
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    
    

    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Post('/createRoom')
    async createRoom(@Body() createRoomDto: CreateRoomDto) {
        try {
            console.log(createRoomDto)
            const newRoom = await this.roomsService.createRoomHTTP(createRoomDto);
            const images = await this.roomsService.getImagesOfRoom(newRoom?.id);
            this.eventEmitter.emit('addRoom', {newRoom, ownerID: createRoomDto.ownerID, images});
        } catch (error) {
            throw error;
        }
	}

	@UseGuards(RolesGuard)
	@Roles(Role.Owner, Role.Admin)
	@Post(':userId/:roomId/mute')
	async muteUser(@Body() data: { userId: string, roomId: string, duration : number }) {
        console.log('this line for muted user');            
        try {
            const infoUser = await this.roomsService.getUserInfo(data.userId);
            const role = await this.roomsService.handleMuteUser(data) ? 'admins' : 'members';
            this.eventEmitter.emit('muteMember', {roomId: data.roomId, userMuted: data.userId});
            return {
                id: infoUser.id,
                images: [infoUser.avatarUrl],
                name: infoUser.name,
                role
            };
        } catch (error) {
            throw error;
        }
	}
}