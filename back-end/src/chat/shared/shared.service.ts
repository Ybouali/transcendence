/* eslint-disable prettier/prettier */

export class SharedService {
    static AllSockets: string[] = [];
    static UsersSockets: Map<string, string[]> = new Map();
}