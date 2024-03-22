import { Socket } from "socket.io";
import { Game } from "./Game";
export let roomSetting = {
    num: 1,
    duel :1,
    Rooms: new Map<string, string[]>(),
    Id: [],
    queue: [],
    room : new Map<string, string>(),
    Game : new Map<string, Game>()
};

export const globalVar = {
    Width: 1600,
    Height: 600,
    PuddleHeight : 200,
    PuddleWight : 50
};
 