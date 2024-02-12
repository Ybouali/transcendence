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
  async loginIntraNe(@Request() req) {}
  
  @UseGuards(IntraGuard)
  @Get('42/callback')
  async loginIntraNew(@Request() req) {

    console.log(req.user);

    const { usual_full_name, login, email } = req.user;

    const { link } = req.user.image;

    const extractedData: IntraUserDto = new IntraUserDto();

    // store the data 
    extractedData.login = login;
    extractedData.fullName = usual_full_name;
    extractedData.avatarNameUrl = link;
    extractedData.email = email;

    const tokens: Tokens = await this.authService.loginInra(extractedData);

    this.logger.debug({
      tokens
    })
    

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
