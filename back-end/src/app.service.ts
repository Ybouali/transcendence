import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class AppService {

  private logger = new Logger(AppService.name);

  constructor(private config: ConfigService) { }

  getHello(): string {
    return 'Hello World!';
  }

  init_server(): void {

    const path_avatars = this.config.get('PATH_AVATAR_USERS');

    // check for the folder of avatar users is exist 
    // if not, create the folder and log a worning 
    if (!fs.existsSync(path_avatars))
    {
      this.logger.error(`Make suer to add a image for the default Avatar at ${path_avatars}`);
      
      fs.mkdir(path_avatars, (err) => {
        if (err) {
          this.logger.error(`Could not create the folder (${path_avatars}) , Make sure to create this folder by yourself :)`);
        }
      })
    }
    
    const path_qr_codes = this.config.get('PATH_QR_CODES');
    
    // check if the folder of the qrcodes is exist
    if (!fs.existsSync(path_qr_codes))
    {
      fs.mkdir(path_qr_codes, (err) => {
        if (err) {
          this.logger.error(`Could not create the folder (${path_qr_codes}) , Make sure to create this folder by yourself :)`);
        }
      })
    }
  }

}
