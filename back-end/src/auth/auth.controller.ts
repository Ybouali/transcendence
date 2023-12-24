import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { GetUser } from 'src/decorators';
import { User } from '@prisma/client';
import { LoginGuard } from './guard';
import { Tokens } from 'src/types';
import { AuthIntraDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('login/intranet')
  async loginIntra(@Body() dto: AuthIntraDto) {
    return await this.authService.loginInra(dto.code);
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

  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(@Res() res: Response, @GetUser() user: User) {
    const { access_token } = await this.authService.refreshToken(user);

    res.setHeader('access_token', access_token);

    res.send('done');
  }
}
