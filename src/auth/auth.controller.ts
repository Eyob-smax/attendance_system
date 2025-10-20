import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateAuthDto } from './dto/auth.dto.js';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Body(ValidationPipe) authDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(authDto);
    if (result.user.id) {
      res.cookie('token', result.token, {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      });
    }

    return {
      message: result.message,
      user: result.user,
    };
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    const result = await this.authService.logout(res);
    return res.status(200).json(result);
  }
}
