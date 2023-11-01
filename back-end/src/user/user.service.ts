import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as speakeasy from "speakeasy";
import { User } from '@prisma/client';
import * as QRCode from 'qrcode'

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService ) { }

    async getQRcode (user: User) {
        // generate QR code
        const secret = speakeasy.generateSecret({
            name: user.username
        });

        console.log(secret);

        console.log("------------> ", secret.otpauth_url);

        const data = await QRCode.toDataURL(secret.otpauth_url);

        console.log(data);
        
        return 'yessage';
    }
}
