import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
  Param,
  Header,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GetUser } from 'src/decorators';
import { User } from '@prisma/client';
import { LoginGuard } from './guard';
import { Tokens } from 'src/types';

@Controller('auth')
export class AuthController {

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

  @HttpCode(HttpStatus.ACCEPTED)
  @Header('Content-Type', 'application/json')
  @Post('login/intranet/:code')
  async loginIntra(@Param('code') code: string): Promise<Tokens> {
    
    const tokens: Tokens = await this.authService.loginInra(code);

    return tokens;
  }

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
