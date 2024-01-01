/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { RoomDto } from "./dto/room-conv.dto";
import { RoomMessageDto } from "./dto/room-message.dto";
// import { RolesGuard } from "./guards/roles.guard";
// import { Role } from "./guards/role.enum";
// import { Roles } from "./guards/roles";

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

    // @UseGuards(RolesGuard)
    // @Roles(Role.Member, Role.Admin, Role.Owner)
    @Get(':userId/:roomId/members')
    async getRoomMembers(@Param('userId') userId: string, @Param('roomId') roomId: string): Promise<any> {
        return this.roomsService.getRoomMembers(roomId);
    }

}