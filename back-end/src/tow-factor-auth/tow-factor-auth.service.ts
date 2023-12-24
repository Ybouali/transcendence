import { Injectable, InternalServerErrorException, NotAcceptableException, Res } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators';
import * as speakeasy from "speakeasy";
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response }  from 'express'

@Injectable()
export class TowFactorAuthService {

    constructor(
        private prisma: PrismaService
    ) { }

    // validate will return the QC code image to the user
    async validate(@GetUser() user: User, @Res() res: Response) {

        try {
            
            let fileName: string;

            // check if the user has already been generated a QR Code
            if (user.qrCodeFileName === "/")
            {
                const secret = speakeasy.generateSecret({
                    name: 'transcendence'
                });
        
                // console.log({secret});
        
                console.log({secret_url: secret.otpauth_url});
        
                const data = await QRCode.toBuffer(secret.otpauth_url);

                fileName = user.id + '_RQCODE.png';
                
                // Note: file name based on the user id 
                const path_file = process.env.PATH_QR_CODES + fileName;
                
                fs.writeFile(path_file, data, (err) => {
                    if (err)
                    {
                        throw new InternalServerErrorException("Could not write QR Code file");
                    }
                })

                // set the file name of the QR Code file
                const tmp = await this.prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        qrCodeFileName: fileName,
                        towFactorSecret: secret.base32
                    }
                })
            }

            if (fileName === undefined)
            {
                fileName = user.qrCodeFileName;
            }

            const pathFile: string = process.env.PATH_QR_CODES + fileName;

            res.sendFile(pathFile);

        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async confirm(@GetUser() user: User, code: string) {

        try {
            
            console.log(user.towFactorSecret)

            // verify the user tow factor using speakeasy 
            const verify = speakeasy.totp.verify({
                secret: user.towFactorSecret,
                encoding: 'base32',
                token: code
            })

            // if is not verified throw an Not Acceptable Exception 
            if (!verify)
            {
                throw new NotAcceptableException();
            }

            // set the user tow factor to true 
            await this.prisma.user.update({
                where: { id: user.id },
                data: { twoFactor: true },
            });

            return { message: 'confirm' };

        } catch (error) {
            throw new InternalServerErrorException();
        }

    }

}
