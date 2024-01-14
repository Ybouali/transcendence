import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { IntraUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from 'src/types';
import { GetUser } from 'src/decorators';
import { User } from '@prisma/client';
import { EncryptionService } from 'src/encryption/encryption.service';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private encrypt: EncryptionService,
  ) {}

  private readonly salt: string = process.env.SALT_ENCRYPT;

  async logout(user: User) {
    await this.prisma.user.update(
      {
        where: { id: user.id },
        data: {
          accessToken: "offline",
          refreshToken: "logout"
        }
      }
    )
  }

  // TODO: implement the logging using intra 42
  async loginInra(code: string): Promise<Tokens> {
    try {
      
      // get the user data from intra 42 api's
      const dataIntra: IntraUserDto = await this.fetchDataUserFromIntra(code);
      
      if (dataIntra === undefined) {
        throw new NotAcceptableException();
      }

      // check if the user is already in the database by fetching the user by email address

      const user: User = await this.prisma.user.findFirst({
        where: { email: dataIntra.email },
      });

      // if the user exists in the database just return the tokens
      if (user) {
        return await this.returnTokens(user.id, user.email);
      }
      
      // store new user in database
      const newUser: User = await this.prisma.user.create({
        data: {
          username: dataIntra.login,
          email: dataIntra.email,
          fullName: dataIntra.fullName,
          avatarName: dataIntra.avatarNameUrl,
          avatarNamePath: "nothing",
          avatarupdated: false,
          isOnLine: true,
          accessToken: 'offline',
          refreshToken: 'logout',
          twoFactor: false,
          qrCodeFileName: "nothing",
          towFactorSecret: "nothing"
        }
      });

      // make sure the user is created and return tokens
      if (newUser) {
        return await this.returnTokens(newUser.id, newUser.email);
      }
      else {
        throw new NotAcceptableException();
      }
      
    } catch (error) {
      this.logger.error(error.message);
      throw new NotAcceptableException();
    }
  }

  // async signup(dto: AuthDto): Promise<Tokens> {
  //   try {
  //     // Hash the password
  //     const hash: string = await argon2.hash(dto.password);

  //     // generate a name from the email address
  //     let name: string = dto.email.split('@')[0];

  //     // store the user into db
  //     const user = await this.prisma.user.create({
  //       data: {
  //         username: name,
  //         email: dto.email,
  //         verifiedEmail: false,
  //         password: hash,
  //         avatarName: 'defaultAvatar.png',
  //         isOnLine: true,
  //         accessToken: 'token',
  //         refreshToken: 'token',
  //       },
  //     });

  //     return await this.returnTokes(user.id, user.email);
  //   } catch (error) {
  //     console.log({
  //       message: error.message,
  //     });
  //     throw new NotAcceptableException();
  //   }
  // }

  async refreshToken(@GetUser() user: User): Promise<Tokens> {

    return await this.returnTokens(user.id, user.email);
    // const access_token: string = await this.generateJwtToken(
    //   user.username,
    //   user.email,
    //   60 * 5,
    // );

    // const hashAT: string = (await this.encrypt.encrypt(access_token));

    // await this.prisma.user.update({
    //   where: { id: user.id },
    //   data: { accessToken: hashAT, isOnLine: true },
    // });

    // return {
    //   access_token,
    // };
  }

  // async signin(dto: AuthDto) {
  //   try {
  //     // get the user by email address
  //     const user = await this.prisma.user.findUnique({
  //       where: { email: dto.email },
  //     });

  //     // verify user password
  //     const isMatch = await argon2.verify(user.password, dto.password);

  //     if (!isMatch) {
  //       throw new NotAcceptableException();
  //     }

  //     // get tokens for the login user
  //     const tokens: Tokens = await this.generateTokens(
  //       user.username,
  //       user.email,
  //     );

  //     // hash the tokens

  //     const hashAT: string = await argon2.hash(tokens.access_token);

  //     const hashRT: string = await argon2.hash(tokens.refresh_token);

  //     this.logger.log(
  //       `A Fin a ba ${user.username}, a mrahba bik a moulay o hawl 3la server rah 3la 9ad lhal HHHHHHHHHHHHH`,
  //     );

  //     // update the user . store the tokens in the database
  //     await this.prisma.user.update({
  //       where: { id: user.id },
  //       data: { accessToken: hashAT, refreshToken: hashRT },
  //     });

  //     return tokens;
  //   } catch (error) {
  //     throw new NotAcceptableException();
  //   }
  // }

  async generateTokens(username: string, email: string): Promise<Tokens> {
    try {
      // generate the tokens for the user
      const [at, rt] = await Promise.all([
        this.generateJwtToken(username, email, 60 * 5),
        this.generateJwtToken(username, email, 60 * 60 * 24 * 7),
      ]);

      return {
        access_token: at,
        refresh_token: rt,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // generate the JWT token
  async generateJwtToken(
    username: string,
    email: string,
    expiresIn: number,
  ): Promise<string> {
    const secret: string = process.env.SECRET_JWT_TOKEN;

    const token = this.jwt.sign(
      {
        sub: username,
        email,
      },
      {
        secret,
        expiresIn,
      },
    );

    return token;
  }

  private async returnTokens(id: string, email: string): Promise<Tokens> {

    // generate the tokens and store the email address and username in the jwt token
    const tokens: Tokens = await this.generateTokens(id, email);

    // encrypt the access token
    const hashAT: string = await this.encrypt.encrypt(tokens.access_token);
    
    // encrypt the refresh token
    const hashRT: string = await this.encrypt.encrypt(tokens.refresh_token);
    
    // update the user access refresh tokens
    const updateUser = await this.prisma.user.update({
      where: { id: id },
      data: { accessToken: hashAT, refreshToken: hashRT },
    });

    if (!updateUser) {
      throw new NotAcceptableException()
    }

    return tokens;
  }

  private async fetchDataUserFromIntra(code: string): Promise<IntraUserDto> {
    try {
      // init data from
      const form = new FormData();

      // get grant type
      const grant_type: string = process.env.INTRA_GRANT_TYPE;

      // get client id
      const client_id: string = process.env.INTRA_CLIENT_ID;

      // get client secret
      const client_secret: string = process.env.INTRA_CLIENT_SECRET;

      // get redirect url
      const redirect_uri: string = process.env.INTRA_REDIRECT_URI;

      // append grant type to header
      form.append('grant_type', grant_type);

      // append client id to header
      form.append('client_id', client_id);

      // append client secret to header
      form.append('client_secret', client_secret);

      // append code to header
      form.append('code', code);

      // append client secret to header
      form.append('redirect_uri', redirect_uri);
      
      // make a req to the intra to get the access token
      const res = await axios.post('https://api.intra.42.fr/oauth/token/', form)

      // get the access_token from data of intra 42
      const { access_token } = res.data;

      // check if the access token is here
      if (access_token === undefined) {
        throw new NotAcceptableException();
      }

      // add the bearer string to the access token
      const headerAccessToken = 'Bearer ' + access_token;

      // get info of the user with his access token
      const dataInra = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: headerAccessToken
        }
      });

      // extract data from dataIntra
      const { usual_full_name, login, email } = dataInra.data;

      const { link } = dataInra.data.image;

      let extractedData: IntraUserDto = new IntraUserDto();

      // store the data 
      extractedData.login = login;
      extractedData.fullName = usual_full_name;
      extractedData.avatarNameUrl = link;
      extractedData.email = email;

      // check if the data is here
      if (
        extractedData.email === undefined ||
        extractedData.avatarNameUrl === undefined ||
        extractedData.fullName === undefined ||
        extractedData.login === undefined
      ) {
        throw new NotAcceptableException();
      }

      return extractedData;
    } catch (error) {
      this.logger.error(error);
      throw new NotAcceptableException();
    }
  }
}
