
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { roomSetting, Id} from "./object";
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
    onJoinGame(client: Socket, messsage : {userId: string}) {
        console.log("user ID", messsage.userId )
        if(!(checkId(messsage.userId, client)))
            joinRoom(this.server, client)
    }
    @SubscribeMessage('OneVSone')
    OneVSone(client: Socket){
        OneGame(this.server, client);
    }
}
function checkId(cltId : string, client : Socket){
        if(Id.has(cltId))
        {
            console.log("id already exists :", cltId)
            return(1);
        }
        else
            Id.set(cltId, client.id);
        return(0);
}
function QueueWaiting( socket: Socket) {
    if (roomSetting.queue.includes(socket.id)){
        console.log("this player already exists in waiting room")
        return ;
    }
     if (checkSocket(socket))
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
    QueueWaiting(socket)
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
            roomSetting.loser = Socket.id;
            const socketId = Array.from(room);
            for (const socket of socketId) {
                const s = io.sockets.sockets.get(socket);
                if (s) {
                    console.log(s.id, "left ", roomName);
                    roomSetting.winner = s.id;
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

function OneGame(io : Server, socket:Socket){
    io.to(socket.id).emit("vsOne", true);
}

