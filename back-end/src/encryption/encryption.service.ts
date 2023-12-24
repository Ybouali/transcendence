import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  constructor() {}

  // get the secret from the config service
  private readonly secret = process.env.ENCRYPT_SECRET;

  // get the salt from the config service
  private readonly salt: string = process.env.SALT_ENCRYPT;

  // get the algorithem from the config service
  private readonly algo = process.env.ALGORITHM_ENCRYPT;

  async encrypt(toEncrypt: string): Promise<string> {
    // console.log(
    //   '------------------------- ENCRIPT RUNNING  ------------------------',
    // );
    // generate the key
    const key = crypto.scryptSync(this.secret, this.salt, 32);

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(this.algo, key, iv);

    let encryptedData = cipher.update(toEncrypt, 'utf-8', 'hex');

    encryptedData += cipher.final('hex');

    const returnData = `${iv.toString('hex')}:${encryptedData}`;

    // console.log({
    //   key,
    //   iv,
    //   cipher,
    //   encryptedData,
    //   returnData,
    // });

    return returnData;
  }

  async decrypt(toDecrypt: string): Promise<string> {
    const [iv, data] = toDecrypt.split(':');

    const key = crypto.scryptSync(this.secret, this.salt, 32);

    const decipher = crypto.createDecipheriv(
      this.algo,
      key,
      Buffer.from(iv, 'hex'),
    );

    let decryptedData = decipher.update(data, 'hex', 'utf-8');

    decryptedData += decipher.final('utf-8');

    return decryptedData;
  }
}
