import { HttpCode, HttpStatus, Injectable, InternalServerErrorException, Logger, NotAcceptableException, Res } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators';
import * as speakeasy from "speakeasy";
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response }  from 'express'

@Injectable()
export class TowFactorAuthService {

    private logger = new Logger(TowFactorAuthService.name);

    constructor(
        private prisma: PrismaService
    ) { }

    // validate will return the QC code image to the user
    async validate(user: User, res: Response): Promise<User> {

        try {
            
            let fileName: string;

            this.logger.debug({
                user
            });

            // check if the user has already been generated a QR Code
            if (user.qrCodeFileName === "nothing" && user.twoFactor)
            {
                this.logger.debug("hello from here");
                
                const secret = speakeasy.generateSecret({
                    name: 'transcendence'
                });
        
                // console.log({secret});
        
                console.log({secret_url: secret.otpauth_url});
        
                const data = await QRCode.toBuffer(secret.otpauth_url);

                fileName = user.id + '_RQCODE.png';
                
                // Note: file name based on the user id 
                const path_file = 'public/qrcodes/' + fileName;
                
                fs.writeFile(path_file, data, (err) => {
                    if (err)
                    {
                        throw new InternalServerErrorException("Could not write QR Code file");
                    }
                })

                // set the file name of the QR Code file
                const tmp: User = await this.prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        qrCodeFileName: fileName,
                        towFactorSecret: secret.base32,
                        towFactorToRedirect: true,
                        twoFactor: true,
                    }
                })

                delete tmp.accessToken;
                delete tmp.refreshToken;

                return tmp;
            }
            
            return user;

        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async confirm(user: User, code: string) {

        try {
            
            // console.log(user.towFactorSecret)

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
                data: { twoFactor: true, towFactorToRedirect: false },
            });

            return { message: 'confirm' };

        } catch (error) {
            throw new InternalServerErrorException();
        }

    }

}
