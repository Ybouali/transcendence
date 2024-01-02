/* eslint-disable prettier/prettier */
import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post, UseGuards} from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { RoomDto } from "./dto/room-conv.dto";
import { RoomMessageDto } from "./dto/room-message.dto";
// import { error } from "console";
import { RolesGuard } from "./guards/roles.guard";
import { Role } from "./guards/role.enum";
import { Roles } from "./guards/roles";

@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    // userId for test
    @Get('all/:userId')
    async getRoomsForUser(@Param('userId') userId: string): Promise<RoomDto[]> {
        return this.roomsService.getRoomsForUser(userId);
    }

    @Get('messages/:roomId')
    async getMessagesForRoom(
        @Param('roomId') roomId: string,
    ): Promise<RoomMessageDto[]> {
        return this.roomsService.getMessagesForRoom(roomId);
    }

    @Get(':userId/:roomId/members')
    async getRoomMembers(@Param('userId') userId: string, @Param('roomId') roomId: string): Promise<any> {
        return this.roomsService.getRoomMembers(roomId);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Owner)
    @Post(':userId/:roomId/:addedUserId/add')
    async addMember(@Param('userId') userId: string,@Param('roomId') roomId: string, @Param('addedUserId') addedUserId: string)
    {
        try {
            const room = await this.roomsService.findRoomById(roomId);
            if (!room) {
                throw new NotFoundException('Room not found');
            }
            await this.roomsService.addUserToRoom(roomId, addedUserId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Internal server error');
        }
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Owner)
    @Post(':userId/:roomId/kick')
    async kickMember(@Param('userId') userId: string ,@Body() room1: { adminId: string; roomId: string; userId: string })
    {
        try {
            await this.roomsService.kickUserfromRoomHTTP(room1.adminId, room1.roomId, room1.userId);
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Admin, Role.Owner)
    @Post(':userId/:roomId/ban')
    async banMember(@Param('userId') userId: string ,@Body() room1: { adminId: string; roomId: string; bannedId: string })
    {
        try {
            await  this.roomsService.banUserInRoomHTTP(room1.adminId, room1.roomId, room1.bannedId);
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Owner)
    @Post(':userId/:roomId/setAdmin')
	async setAdminToRoom(@Body() room: { adminId: string; roomId: string; newAdmin: string }) {
        try {
            await this.roomsService.addAdminToRoomHTTP(room.adminId, room.roomId, room.newAdmin);
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(RolesGuard)
    @Roles(Role.Owner, Role.Admin, Role.Member)
    @Post(':userId/:roomId/leaveROOM')
    async leaveRoom(@Body() data: { userId: string, roomId: string }): Promise<void> {
        try {
            await this.roomsService.leaveRoomHTTP(data);
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

    @Post('/joinROOM')
    async joinRoom(@Body() data: { userId: string, roomId: string, password: string }): Promise<void> {
        try {
            await this.roomsService.joinRoomHTTP(data);
        } catch (error) {
            throw error;
        }
    }
}