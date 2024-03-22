
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { roomSetting} from "./object";
import { Game } from "./Game";

@WebSocketGateway({ cors: '*' })
export class socketGateway {
    @WebSocketServer()
    server: Server;
    constructor() {
        console.log("constructer called");
    }

    handleConnection(client: Socket) {
        console.log("user connected", client.id)
    }
    handleDisconnect(client: Socket) {
        console.log("user disconnected :", client.id)
        checkDectonnectin(this.server, client)

    }
    @SubscribeMessage('test')
    ontest(client: Socket, MessageBody: string) {
        console.log("getting the event name ", MessageBody);
    }

    @SubscribeMessage('onJoinGame')
    onJoinGame(client: Socket) {
        joinRoom(this.server, client)
    }
    @SubscribeMessage('OneVSone')
    OneVSone(client: Socket){
        OneGame(this.server, client);
    }

    @SubscribeMessage('leaveGame')
    onLeaveGame(@MessageBody() client : Socket) {
         checkDectonnectin(this.server, client) ;
    }
}

function QueueWaiting(io: Server, socket: Socket) {
    if (roomSetting.queue.includes(socket.id))
        console.log("this player already exists in waiting room")
    else if (checkSocket(socket))
        console.log("player already exists in other room")
    else {
        if (roomSetting.queue.length < 3) {
            roomSetting.queue.push(socket.id)
            console.log("id ", socket.id, "is waiting")
        }
    }
}

function joinRoom(io: Server, socket: Socket) {
    const roomName = "room" + roomSetting.num;
    const roomInfo = io.sockets.adapter.rooms;
    let game : Game;
    QueueWaiting(io, socket)
    if (roomSetting.queue.length == 2) {
        const Id: Set<string> = new Set(roomSetting.queue)
        roomInfo.set(roomName, Id)
        roomSetting.Rooms.set(roomName, roomSetting.queue)
        io.to(roomName).emit("StartGame", true)
        console.log("players ready to play in ", roomName)
        game = new Game(io, roomSetting.queue, roomName);
        io.to(roomSetting.queue[0]).emit("Puddle1", true);
        io.to(roomSetting.queue[1]).emit("Puddle2", true);
        roomSetting.Game.set(roomName, game);
        roomSetting.queue = []
        roomSetting.num += 1
        startGame(io, game);
    }
};

function checkDectonnectin(io: Server, Socket: Socket) {
    const roomInfo = io.sockets.adapter.rooms;
    let RoomName : string;
    for (const [roomName, room] of roomInfo.entries()) {
        if (room.has(Socket.id)) {
            RoomName = roomName;
            Socket.leave(roomName);
            console.log(Socket.id, "leaved ", roomName);
            const socketId = Array.from(room);
            for (const socket of socketId) {
                const s = io.sockets.sockets.get(socket);
                if (s) {
                    // roomSetting.queue.push(s);
                    // console.log(s.id, "is waiting for new game");
                    console.log(s.id, "left ", roomName);
                    s.leave(roomName);
                }
            }
        }
    }
    leaveGame(RoomName);
}


function leaveGame(roomName){
    for(const room of(roomSetting.Rooms.keys())){
        if(room  == roomName){
            roomSetting.Game.delete(room);
            roomSetting.Rooms.delete(room);
        }
    }
}

function startGame(io: Server, game: Game) {
    game.Ball.start(io)
    
}

function checkSocket(socket: Socket) {
    for (let tmp of roomSetting.Rooms.values()) {
        if (tmp.includes(socket.id))
        return (true)
}
return (false)
}

function leaveQueue(io: Server, socket: Socket) {
    roomSetting.queue.filter(value => value !== socket.id) 
}

function OneGame(io : Server, socket:Socket){

    const RoomName = "duel" + roomSetting.duel;
    const roomInfo = io.sockets.adapter.rooms;
    if( Array.from(roomSetting.room.values()).includes(socket.id))
        console.log("you are already existing in one room")
    else{
    roomSetting.room.set(RoomName, socket.id);
    const tmp: Set<string> =new  Set(socket.id)
    roomInfo.set(RoomName, tmp);
    if (io.sockets.adapter.rooms.get(RoomName)?.has(socket.id)) {
        console.log(`Socket ${socket.id} is in room ${RoomName}`);
    } else {
        console.log(`Socket ${socket.id} is NOT in room ${RoomName}`);
    }
    console.log(socket.id);
    console.log("room :", RoomName , " is created")
    io.emit("vsOne", true);
    roomSetting.duel += 1;
}
}
