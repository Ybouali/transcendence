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
import { AuthDto } from './dto';
import { AuthService } from './auth.service';
import { Tokens } from './types';
import { Response } from 'express';
import { GetUser } from 'src/decorators';
import { User } from '@prisma/client';
import { LoginGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('signup')
  async signup(@Body() dto: AuthDto, @Res() res: Response) {
    const tokens: Tokens = await this.authService.signup(dto);

    console.log({
      tokens,
    });

    res.setHeader('access_token', tokens.access_token);

    res.setHeader('refresh_token', tokens.refresh_token);

    return res.send({
      message: 'done',
    });
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('signin')
  async signin(@Body() dto: AuthDto, @Res() res: Response) {
    const tokens: Tokens = await this.authService.signin(dto);

    res.setHeader('access_token', tokens.access_token);

    res.setHeader('refresh_token', tokens.refresh_token);

    return res.send({
      message: 'done',
    });
  }

  @UseGuards(LoginGuard)
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  async refresh(@Res() res: Response, @GetUser() user: User) {
    const { access_token } = await this.authService.refreshToken(user);

    res.setHeader('access_token', access_token);

    res.send('done');
  }
}
