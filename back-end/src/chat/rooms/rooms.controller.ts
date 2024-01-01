/* eslint-disable prettier/prettier */
import { Controller, Get, InternalServerErrorException, NotFoundException, Param, Post, UseGuards} from "@nestjs/common";
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
}