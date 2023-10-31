import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService ) { }

    async getMe(id: string) {
        try {

            
            
        } catch (error) {
            throw new NotAcceptableException();
        }
    }
}
