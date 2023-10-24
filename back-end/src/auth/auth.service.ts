import { Injectable, NotAcceptableException } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService ) {}

    async signup (dto: AuthDto) {

        try {

            // Hash the password
            const hash = await argon2.hash(dto.password);
            
            // generate a name from the email address 
            const name = dto.email.split('@')[0];

            // store the user into db
            const user = await this.prisma.user.create({
                data: {
                    username: name,
                    email: dto.email,
                    verifiedEmail: false,
                    password: hash,
                    avatarUrl: 'https://pics.freeicons.io/uploads/icons/png/16671574911586787867-512.png',
                    Status: true,
                    twoFactor: false
                }
            });
            
            // need to generate token and return it to the client 
            return user;
        } catch (error) {
            throw new NotAcceptableException();
        }
    }
    
    async signin (dto: AuthDto) {
        
        try {
            
            // get the user by email address
            const user = await this.prisma.user.findUnique({
                where: { email: dto.email }
            });

            // verify user password

            const isMatch = await argon2.verify(user.password, dto.password);

            console.log(user, isMatch);

            return user;

        } catch (error) {
            throw new NotAcceptableException();
        }
    }


}
