import { Injectable } from '@nestjs/common';
import { createDecipheriv, createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
// import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  constructor() {}

  // get the secret from the config service
  private readonly secret = process.env.ENCRYPT_SECRET;

  // get the salt from the config service
  private readonly salt: string = process.env.SALT_ENCRYPT;

  // get the algorithem from the config service
  private readonly algo = process.env.ALGORITHM_ENCRYPT;

  async encrypt(toEncrypt: string): Promise<Buffer> {

    // generate key
    const key = ((await promisify(scrypt)(this.secret, 'salt', 32)) as Buffer);

    // generate iv
    const iv = randomBytes(16);

    // generate cipher
    const cipher = createCipheriv(this.algo, key, iv);

    // encrypt the data
    const encryptedText = Buffer.concat([
      cipher.update(toEncrypt),
      cipher.final(),
    ]);

    return encryptedText;
  }

  async decrypt(toDecrypt: Buffer): Promise<string> {

    // generate key
    const key = ((await promisify(scrypt)(this.secret, 'salt', 32)) as Buffer);

    // generate iv
    const iv = randomBytes(16);

    const decipher = createDecipheriv(this.algo, key, iv);

    const decryptedText = Buffer.concat([
      decipher.update(toDecrypt),
      decipher.final(),
    ]);

    return decryptedText.toString();
  }
}
