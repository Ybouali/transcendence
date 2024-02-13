import {
  Controller,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
  Request,
  Param,
  Header,
  Req,
  Logger,
  Redirect,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GetUser } from 'src/decorators';
import { User } from '@prisma/client';
import { IntraGuard, LoginGuard } from './guard';
import { Tokens } from 'src/types';
import { IntraUserDto } from './dto';
import * as fs from 'fs';

@Controller('auth')
export class AuthController {

  private logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Get('/logout')
  async logout(@GetUser() user: User): Promise<{ message: string }> {

    this.authService.logout(user);

    return {
      message: "done"
    }
  }

  @UseGuards(IntraGuard)
  @Get('42')
  async loginIntraNe(@Request() req) {
    return;
  }

  @UseGuards(IntraGuard)
  @Get('42/callback')
  // @Redirect('/')
  async loginIntraNew(@Request() req) {

    const { usual_full_name, login, email } = req.user;

    // const pathAvatars = process.env.PATH_AVATAR_USERS;

    // const port = process.env.PORT_BACK_END;

    const link = "http";

    const extractedData: IntraUserDto = new IntraUserDto();

    // store the data 
    extractedData.login = login;
    extractedData.fullName = usual_full_name;
    extractedData.avatarNameUrl = link;
    extractedData.email = email;

    this.logger.debug(
      "--------------------------------------------------------------",
      {
        extractedData
      },
      "---------------------------------------------------------------"
    )

    throw new NotAcceptableException();

    const tokens: Tokens = await this.authService.loginInra(extractedData);

    return tokens;
  }


  // @HttpCode(HttpStatus.ACCEPTED)
  // @Header('Content-Type', 'application/json')
  // @Get('login/intranet/:code')
  // async loginIntra(@Param('code') code: string, @Req() req: Request): Promise<Tokens> {
    
  //   const tokens: Tokens = await this.authService.loginInra(code, req);

  //   return tokens;
  // }

  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(@Res() res: Response, @GetUser() user: User): Promise<{ access_token: string }> {

    const { access_token } = await this.authService.refreshToken(user);
    
    return {
      access_token
    };
  }

  // @HttpCode(HttpStatus.ACCEPTED)
  // @Post('signup')
  // async signup(@Body() dto: AuthDto, @Res() res: Response) {
  //   // get the tokens from the auth service
  //   const tokens: Tokens = await this.authService.signup(dto);

  //   // set the tokens in the header of the response

  //   res.setHeader('access_token', tokens.access_token);

  //   res.setHeader('refresh_token', tokens.refresh_token);

  //   return res.send({
  //     message: 'done',
  //   });
  // }

  // @HttpCode(HttpStatus.ACCEPTED)
  // @Post('signin')
  // async signin(@Body() dto: AuthDto, @Res() res: Response) {
  //   // get the tokens from the auth service

  //   const tokens: Tokens = await this.authService.signin(dto);

  //   // set the tokens in the header of the response

  //   res.setHeader('access_token', tokens.access_token);

  //   res.setHeader('refresh_token', tokens.refresh_token);

  //   return res.send({
  //     message: 'done',
  //   });
  // }
}
