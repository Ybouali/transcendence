import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
// import { createDecipheriv, createCipheriv, randomBytes, scrypt } from 'crypto';
// const crypto = require('crypto');
import * as crypto from 'crypto';
import { promisify } from 'util';

@Injectable()
export class EncryptionService {

  private logger = new Logger(EncryptionService.name);

  constructor() {}

  // get the secret from the config service
  private readonly key = process.env.ENCRYPT_SECRET;

  // get the salt from the config service
  private readonly salt: string = process.env.SALT_ENCRYPT;

  // get the algorithem from the config service
  private readonly algo = process.env.ALGORITHM_ENCRYPT;

  async encrypt(toEncrypt: string): Promise<string> {

    try {

      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv(this.algo, Buffer.from(this.key), Buffer.from(iv));

      let encrypted = cipher.update(toEncrypt, 'utf8', 'hex');

      encrypted += cipher.final('hex');

      console.log('Encryption Complete');

      console.log('Encrypted Data:', encrypted);

      // Return or use the encrypted data as needed


      // console.log("here is the encryption 1", toEncrypt);

      // const iv: Buffer = crypto.randomBytes(16);
      
      // const cipher = crypto.createCipheriv(this.algo, this.secret, iv);
      // console.log("here is the encryption 2")
      
      // let encrypted = cipher.update(toEncrypt, 'utf8', 'hex')
      // console.log("here is the encryption 3")
      
      // encrypted += cipher.final('hex');
      // console.log("here is the encryption 4")

      // console.log(encrypted);

      return encrypted;

    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException()
    }


    
    // generate key
    // const key = ((await promisify(scrypt)(this.secret, 'salt', 32)) as Buffer);

    // // generate iv
    // const iv = randomBytes(16);

    // // generate cipher
    // const cipher = createCipheriv(this.algo, key, iv);

    // // encrypt the data
    // const encryptedText = Buffer.concat([
    //   cipher.update(toEncrypt),
    //   cipher.final(),
    // ]);

    
  }

  async decrypt(toDecrypt: string): Promise<string> {

    // generate key
    // const key = ((await promisify(scrypt)(this.secret, 'salt', 32)) as Buffer);

    // // generate iv
    // const iv = randomBytes(16);

    // const decipher = createDecipheriv(this.algo, key, iv);

    // const decryptedText = Buffer.concat([
    //   decipher.update(toDecrypt),
    //   decipher.final(),
    // ]);

    const decryptedText: string = "sqdqsdsqds";

    return decryptedText;
  }
}
