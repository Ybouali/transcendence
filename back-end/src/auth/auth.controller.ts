import { Controller, Post, Body } from '@nestjs/common';
import { AuthDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor (private authService: AuthService) { }

    @Post('/signup')
    login(@Body() dto: AuthDto) {
        return this.authService.signupWithEmail(dto);
    }
}
