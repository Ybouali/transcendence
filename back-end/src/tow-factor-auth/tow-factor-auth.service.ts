import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators';
import * as speakeasy from "speakeasy";
import * as QRCode from 'qrcode';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TowFactorAuthService {

    constructor(
        private config: ConfigService,
        private prisma: PrismaService
    ) { }

    // validate will return the QC code image to the user
    async validate(@GetUser() user: User) {

        // check if the user has already been generated a QR Code
        if (user.pathQrcodeTowFactor === "/")
        {
            const secret = speakeasy.generateSecret({
                name: 'transcendence'
            });
    
            console.log({secret});
    
            console.log({secret_url: secret.otpauth_url});
    
            const data = await QRCode.toBuffer(secret.otpauth_url);

            const fileName: string = user.id + '_RQCODE.png';
            
            // Note: file name based on the user id 
            const path_file = this.config.get('PATH_QR_CODES') + fileName;
            
            fs.writeFile(path_file, data, (err) => {
                if (err)
                {
                    throw new InternalServerErrorException("Could not write QR Code file");
                }
            })

            const tmp = await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    pathQrcodeTowFactor: fileName
                }
            })
            
            // update the user to store the name of the 
        }



        console.log({user: user.pathQrcodeTowFactor});

        return 'user.pathQrcodeTowFactor';

    }



}
