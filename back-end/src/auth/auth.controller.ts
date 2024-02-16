import {
  Controller,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
  Request,
  Logger,
  Redirect,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GetUser } from 'src/decorators';
import { User } from '@prisma/client';
import { IntraGuard, LoginGuard } from './guard';
import { Tokens } from 'src/types';
import { IntraUserDto } from './dto';

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
  @Redirect('http://localhost:3000/profile/')
  async loginIntraNew(@Request() req, @Res() res: Response) {

    const { usual_full_name, username, email } = req.user;

    const link = "/public/images/default.png"

    const extractedData: IntraUserDto = new IntraUserDto();

    // store the data 
    extractedData.login = username;
    extractedData.fullName = usual_full_name;
    extractedData.avatarNameUrl = link;
    extractedData.email = email;

    const tokens: Tokens = await this.authService.loginInra(extractedData);

    res.cookie("access_token", tokens.access_token, { httpOnly: true })
    res.cookie("refresh_token", tokens.refresh_token, { httpOnly: true })

    return ;
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
